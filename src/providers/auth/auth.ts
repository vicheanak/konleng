import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Storage } from '@ionic/storage';

import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { Observable, from, forkJoin } from 'rxjs';

import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

import { AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Action,
  DocumentSnapshotDoesNotExist,
  DocumentSnapshotExists 
} from 'angularfire2/firestore';

import { File } from '@ionic-native/file';
export interface User { 
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export interface Device{
  uuid: string;
  language: string;
  model: string;
}

@Injectable()
export class AuthServiceProvider {

  private user: firebase.User;
  private usersCollection: AngularFirestoreCollection<User>;
  public users: Observable<User[]>;

  private devices: Observable<Device[]>;
  private devicesCollection: AngularFirestoreCollection<Device>;

  constructor(public http: HttpClient, 
    public afAuth: AngularFireAuth,
    public firebaseAuth: FirebaseAuthentication,
    private storage: Storage,
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private file: File
    ) {


    this.usersCollection = this.afStore.collection<User>('users');
    this.users = this.usersCollection.valueChanges();

    this.devicesCollection = this.afStore.collection<Device>('devices');
    this.devices = this.devicesCollection.valueChanges();

    this.storage.get('user').then((user) => {

      this.user = JSON.parse(user);
      
    });

  }

  setDevice(uuid, model, language){
    return new Promise<Object>((resolve, reject) => {
      let device = {
        uuid: uuid,
        model: model,
        language: language
      };
      this.devicesCollection.doc(uuid).set(device).then((res) => {
        resolve(true);
      });
    });
  }

  signInWithEmail(credentials) {
    return new Promise<Object>((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password).then((user) => {
        this.updateUserLogin(user).then((userData) => {
          resolve(user);
        });
      }).catch((error) => {
        reject(error);
      });
    });

  }


  getToken(){
    return this.firebaseAuth.getIdToken(true);
  }

  updateUserLogin(user){
    return new Promise<Object>((resolve, reject) => {
      this.usersCollection.doc(user.uid).get().subscribe((result) => {
        if (!result.exists){
          this.usersCollection.doc(user.uid).set(user).then((res) => {
            this.storage.set('user', JSON.stringify(user));
            this.user = user;
            resolve(user);
          });
        }
        else{
          let userData = result.data();
          this.storage.set('user', JSON.stringify(userData));
          this.user = user;
          resolve(user);
        }
      })
    });
  }

  signInWithFacebook(token) {
    return new Promise<Object>((resolve, reject) => {
      this.firebaseAuth.signInWithFacebook(token).then((user) => {
        this.updateUserLogin(user).then((userData) => {
          resolve(user);
        });
      }).catch((e) => {
        reject(e);
      });
    });
  }

  signUp(credentials) {
    return new Promise<Object>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then((user) => {
        this.storage.set('user', JSON.stringify(user));
      });
    });
  }

  getUserById(uid){
    return new Promise<Object>((resolve, reject) => {
      this.usersCollection.doc(uid).valueChanges().subscribe((user) => {
        resolve(user);
      });
    });
  }

  saveFavorite(listing){
    return new Promise<Object>((resolve, reject) => {
      this.usersCollection.doc(this.user.uid).collection('favorites').doc(listing.id).get().subscribe((result) => {
        if (result.exists){
          this.usersCollection.doc(this.user.uid).collection('favorites').doc(listing.id).delete().then((res) => {
            resolve(false);
          });
        }
        else{
          this.usersCollection.doc(this.user.uid).collection('favorites').doc(listing.id).set(listing).then((res) => {
            resolve(true);
          });
        }
      })
    });
  }

  follow(user){
    return new Promise<Object>((resolve, reject) => {
      this.usersCollection.doc(this.user.uid).collection('follows').doc(user.uid).get().subscribe((result) => {
        if (result.exists){
          this.usersCollection.doc(this.user.uid).collection('follows').doc(user.uid).delete().then((res) => {
            resolve(false);
          });
        }
        else{
          this.usersCollection.doc(this.user.uid).collection('follows').doc(user.uid).set(user).then((res) => {
            resolve(true);
          });
        }
      })
    });
  }

  updatePhonenumbers(listing){

    this.usersCollection.doc(this.user.uid).update({phone1: listing.phone1, phone2: listing.phone2}).then((res) => {

      this.user['phone1'] = listing.phone1;
      this.user['phone2'] = listing.phone2;

      this.storage.set('user', JSON.stringify(this.user));
    });
  }

  updateUser(user){
    return new Promise<Object>((resolve, reject) => {
      this.user.displayName = user.displayName;
      this.user['phone1'] = user.phone1;
      this.user['phone2'] = user.phone2;
      this.user['userType'] = user.userType;
      this.user['agencyName'] = user.agencyName;
      this.usersCollection.doc(this.user.uid).update({
        displayName: user.displayName,
        phone1: user.phone1,
        phone2: user.phone2,
        userType: user.userType,
        agencyName: user.agencyName
      }).then((res) => {
        console.log('UPDATE_USER ==> ', JSON.stringify(user));
        if (user.photoURL.indexOf('firebasestorage.googleapis.com') > 0){
          this.storage.set('user', JSON.stringify(this.user));
          resolve(this.user);
        }
        else{

          let image = user.photoURL;
          let filename = image.substring(image.lastIndexOf('/')+1);
          filename = filename.split('?')[0];
          let path =  image.substring(0,image.lastIndexOf('/')+1);
          
          this.file.readAsDataURL(path, filename).then((dataUrl) => {
            const currentTime = new Date().getTime();
            const storageRef: AngularFireStorageReference = this.afStorage.ref(`users/${user.uid}/images/${currentTime}.jpg`);
            storageRef.putString(dataUrl, 'data_url', {
              contentType: 'image/jpeg'
            }).then(() => {

              storageRef.getDownloadURL().subscribe((url: any) => {
                console.log('URL ==> ', url);
                this.user.photoURL = url;
                this.usersCollection.doc(this.user.uid).update({
                  photoURL: this.user.photoURL,
                }).then((res) => {
                  this.storage.set('user', JSON.stringify(this.user));
                  resolve(this.user);
                });
              });
              
            }).catch((msg) => {
              console.error("ERROR UPDATE_LISTING_IMAGES", JSON.stringify(msg));
            });
          }).catch((error) => {
            console.error("ERORR UPLOAD", JSON.stringify(error));
          })


        }

        
      });



    });
  }

  getUser() {
    return new Promise<Object>((resolve, reject) => {
      this.storage.get('user').then((user) => {
        resolve(JSON.parse(user));
      });
    });
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  isFavorite(listingId) {
    return new Promise<Object>((resolve, reject) => {
      if (this.user){
        this.usersCollection.doc(this.user.uid).collection('favorites').doc(listingId).get().subscribe((result) => {
          if (result.exists){
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
      }
      else{
        resolve(false);
      }

    });
  }

  isFollow(userUid){
    return new Promise<Object>((resolve, reject) => {
      if (this.user){
        this.usersCollection.doc(this.user.uid).collection('follows').doc(userUid).get().subscribe((result) => {
          if (result.exists){
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
      }
      else{
        resolve(false);
      }
    });
  }

  getEmail() {
    return this.user && this.user.email;
  }

  signOut() {
    return new Promise<Object>((resolve, reject) => {
      this.firebaseAuth.signOut().then(() => {
        this.user = null;  
        this.storage.set('user', null);
      });
    });
  }

}
