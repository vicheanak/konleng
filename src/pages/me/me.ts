import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { MyPropertiesPage } from '../my-properties/my-properties';
import { SavedPage } from '../saved/saved';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-me',
	templateUrl: 'me.html'
})
export class MePage {

	constructor(public navCtrl: NavController,
		public translate: TranslateService,
		private storage: Storage) {

	}

	goProfile(){
		this.navCtrl.push(ProfilePage);
	}

	goMyProperties(){
		this.navCtrl.push(MyPropertiesPage);
	}

	goSaved(){
		this.navCtrl.push(SavedPage);
	}

	goSettings(){
		this.navCtrl.push(SettingsPage);
	}

	goLogin(){
		this.navCtrl.push(LoginPage);
	}

	goRegister(){
		this.navCtrl.push(RegisterPage);
	}

	switchLanguage(){
	  	this.storage.get('language').then((val) => {

	  		if (val == 'en'){
	  			this.translate.use('kh');		
	  			this.storage.set('language', 'kh');

	  		}
	  		else if(val == 'kh'){
	  			this.translate.use('en');
	  			this.storage.set('language', 'en');
	  		}
	  	});
	  }

}
