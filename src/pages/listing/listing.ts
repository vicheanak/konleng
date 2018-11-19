import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';

/**
 * Generated class for the ListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 @Component({
   selector: 'page-listing',
   templateUrl: 'listing.html',
 })
 export class ListingPage {

   constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad ListingPage');
   }

   goDetail(){
     this.navCtrl.push(DetailPage);
   }

   presentFilterModal() {
     let filterModal = this.modalCtrl.create(FilterModal, { userId: 8675309 });
       filterModal.onDidDismiss(data => {
       console.log(data);
     });
     filterModal.present();
   }

   


 }

 @Component({
   selector: 'page-listing',
   templateUrl: 'filter.html'
 })
 export class FilterModal {

   public priceRange: any;

   constructor(params: NavParams, public viewCtrl: ViewController) {
     console.log('UserId', params.get('userId'));
   }

    dismiss() {
     let data = { 'foo': 'bar' };
     this.viewCtrl.dismiss(data);
   }

 }
