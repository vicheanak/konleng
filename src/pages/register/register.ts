import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthServiceProvider } from '../../providers/auth/auth';
import { ProfilePage } from '../profile/profile';
import { Storage } from '@ionic/storage';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 @Component({
 	selector: 'page-register',
 	templateUrl: 'register.html',
 })
 export class RegisterPage {

 	registerError: string;
	registerForm: FormGroup;

 	constructor(private storage: Storage, private auth: AuthServiceProvider, 
 		fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams,
 		private serviceProvider: ServiceProvider) {
 		this.registerForm = fb.group({
 			email: ['', Validators.compose([Validators.required, Validators.email])],
 			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
 		});
 	}

 	
ionViewWillEnter(){ this.serviceProvider.transition(); }
 	signup() {
			let data = this.registerForm.value;
			let credentials = {
				email: data.email,
				password: data.password
			};
			this.auth.signUp(credentials).then(
				(user) => {
					
					this.navCtrl.pop();

				},
				error => this.registerError = error.message
			);
	}

 }
