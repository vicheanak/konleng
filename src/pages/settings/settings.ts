import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactUsPage } from '../contact-us/contact-us';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermsOfUsePage } from '../terms-of-use/terms-of-use';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  goContact() {
  	this.navCtrl.push(ContactUsPage);
  }
  goPrivacyPolicy() {
  	this.navCtrl.push(PrivacyPolicyPage);
  }
  goTermsOfUse() {
  	this.navCtrl.push(TermsOfUsePage);
  }

}
