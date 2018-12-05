import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListingPage} from '../listing/listing';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ListingProvider } from '../../providers/listing/listing';
import { ServiceProvider } from '../../providers/service/service';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

	public queryText: string;
  private provinces: any = [];
  private provinceData: any = [];
  private provinceDisplay: any = [];

  constructor(public navCtrl: NavController, 
  	public translate: TranslateService,
  	private storage: Storage,
    private listingProvider: ListingProvider,
    private serviceProvider: ServiceProvider) {

  	this.queryText = '';

    

  }

  ionViewWillEnter() {
    this.listingProvider.getCounter().then((counter) => {
      this.provinces = counter;
    });

   this.serviceProvider.transition();

  }

  doRefresh(refresher) {
    this.listingProvider.getCounter().then((counter) => {
      this.provinces = counter;
      refresher.complete();
    });
  }

  goListing(province){
    this.navCtrl.push(ListingPage, {province: province}, {animate: false});
  }

  searchByKeyword(){
    this.navCtrl.push(ListingPage, {keyword: this.queryText}, {animate: false});
  }

  switchLanguage(){
    this.serviceProvider.switchLanguage();
  }



}