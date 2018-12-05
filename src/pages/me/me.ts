import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { MyPropertiesPage } from '../my-properties/my-properties';
import { SavedPage } from '../saved/saved';
import { FollowPage } from '../follow/follow';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';

import { AuthServiceProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



@Component({
	selector: 'page-me',
	templateUrl: 'me.html'
})
export class MePage {

	myLoading: any;

	constructor(public navCtrl: NavController,
		public translate: TranslateService,
		private storage: Storage,
		private auth: AuthServiceProvider,
		public fb: Facebook,
		private loadingCtrl: LoadingController,
		private serviceProvider: ServiceProvider) {

		

	}

	logout() {
		this.auth.signOut();
		
		// const tabs = this.navCtrl.parent;
		// tabs.select(1)
		// .then(() => tabs.getSelected().push(SearchPage, {}, { animate: false }))
		// .then(() => this.navCtrl.popToRoot());
	}

	ionViewDidLoad(){
		console.log('Me Enter');
	}
	ionViewWillEnter(){ this.serviceProvider.transition(); }
	

	myCallbackFunction = function(_params) {
		return new Promise((resolve, reject) => {
			
			console.log('callbackParam', JSON.stringify(_params));
			resolve();
		});
	}

	goLogin(){
		this.navCtrl.push(LoginPage, {page: 'profile'}, {animate: false});
	}

	presentLoading() {
		this.myLoading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		this.myLoading.present();
	}

	dismissLoading(){
		try{
			this.myLoading.dismiss();
		}catch(e){

		}
	}


	loginWithFacebook() {
		this.presentLoading();
		this.fb.login(['public_profile', 'email'])
		.then( (res: FacebookLoginResponse) => {
			if(res.status == "connected") {
				var fb_id = res.authResponse.userID;
				var fb_token = res.authResponse.accessToken;

				this.auth.signInWithFacebook(fb_token).then((user) => {
					console.log("Login Success");
					this.dismissLoading();
					this.navCtrl.push(ProfilePage, {}, {animate: false});
				});

			} 
			else {
				console.log("An error occurred...");
			}
		})
		.catch((e) => {
			console.log('Error logging into Facebook', e);
		});
	}

	goProfile(){
		this.auth.getUser().then((user) => {
			if (user){
				this.navCtrl.push(ProfilePage, {}, {animate: false});		
			}
			else{
				this.navCtrl.push(LoginPage, {page: 'profile'}, {animate: false});
			}
		});
	}

	goMyProperties(){
		this.auth.getUser().then((user) => {
			if (user){
				this.navCtrl.push(MyPropertiesPage, {user: user}, {animate: false});		
			}
			else{
				this.navCtrl.push(LoginPage, {page: 'my-properties'}, {animate: false});
			}
		});
	}

	goSaved(){
		this.auth.getUser().then((user) => {
			if (user){
				this.navCtrl.push(SavedPage, {}, {animate: false});		
			}
			else{
				this.navCtrl.push(LoginPage, {page: 'saved'}, {animate: false});
			}
		});
	}

	goFollow(){
		this.auth.getUser().then((user) => {
			if (user){
				this.navCtrl.push(FollowPage, {}, {animate: false});
			}
			else{
				this.navCtrl.push(LoginPage, {page: 'saved'}, {animate: false});
			}
		});
	}

	goSettings(){
		this.navCtrl.push(SettingsPage, {}, {animate: false});
	}



	goRegister(){
		this.navCtrl.push(RegisterPage, {}, {animate: false});
	}



}
