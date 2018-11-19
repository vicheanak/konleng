import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditPage } from '../edit/edit';
import { DetailPage } from '../detail/detail';

/**
 * Generated class for the MyPropertiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-my-properties',
  templateUrl: 'my-properties.html',
})
export class MyPropertiesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPropertiesPage');
  }

  goEdit(){
  	this.navCtrl.push(EditPage);
  }

  goDetail(){
    this.navCtrl.push(DetailPage);
  }

}
