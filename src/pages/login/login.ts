import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 @Component({
 	selector: 'page-login',
 	templateUrl: 'login.html',
 })
 export class LoginPage {

 	constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad LoginPage');
 	}

 	promptLostPassword() {
 		const prompt = this.alertCtrl.create({
 			title: 'Lost Password',
 			inputs: [
 			{
 				name: 'phone_number',
 				placeholder: 'Phone Number'
 			}
 			],
 			buttons: [
 			{
 				text: 'Get SMS',
 				handler: data => {
 					this.promptVerification();
 					console.log('Saved clicked', JSON.stringify(data));
 				}
 			}
 			]
 		});
 		prompt.present();
 	}

 	promptVerification() {
 		const prompt = this.alertCtrl.create({
 			title: 'Verify',
 			enableBackdropDismiss: false,
 			inputs: [
 			{
 				name: 'verify_code',
 				placeholder: 'Verify Code',
 				type: 'number'
 			}
 			],
 			buttons: [
 			{
 				text: 'Verify',
 				handler: data => {
 					if (data.verify_code != '1111'){
 						this.promptVerification();
 					}
 					if (data.verify_code == '1111'){
 						this.promptNewPassword();	
 					}
 					
 					
 					console.log('Saved clicked', JSON.stringify(data));
 				}
 			}
 			]
 		});
 		prompt.present();
 	}

 	promptNewPassword() {
 		const prompt = this.alertCtrl.create({
 			title: 'New Password',
 			inputs: [
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
 				text: 'Save',
 				handler: data => {
 					this.presentSuccess();
 					console.log('Saved clicked', JSON.stringify(data));
 				}
 			}
 			]
 		});
 		prompt.present();
 	}

 	presentSuccess() {
 		const prompt = this.alertCtrl.create({
 			title: 'Password Changed!',
 			buttons: [
 			{
 				text: 'Ok',
 				handler: data => {
 					console.log('Saved clicked', JSON.stringify(data));
 				}
 			}
 			]
 		});
 		prompt.present();
 	}

 }
