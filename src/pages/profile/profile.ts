import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  promptChangePassword() {
    const prompt = this.alertCtrl.create({
      title: 'Change Password',
      inputs: [
        {
          name: 'old_password',
          placeholder: 'Old Password'
        },
        {
          name: 'new_password',
          placeholder: 'New Password'
        },
        {
          name: 'confirm_password',
          placeholder: 'Confirm Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {

          	this.showWrongPassword();
            console.log('Saved clicked', JSON.stringify(data));
          }
        }
      ]
    });
    prompt.present();
  }

  showWrongPassword() {
    const confirm = this.alertCtrl.create({
      title: 'Wrong Password!',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            console.log('Disagree clicked');
            this.showSuccessChangedPassword();
          }
        },
        {
          text: 'Retry',
          handler: () => {
            console.log('Agree clicked');
            this.promptChangePassword();
          }
        }
      ]
    });
    confirm.present();
  }

  showSuccessChangedPassword() {
    const confirm = this.alertCtrl.create({
      title: 'Password Changed!',
      buttons: [
        {
          text: 'Done',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
