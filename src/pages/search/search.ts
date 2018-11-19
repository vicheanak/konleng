import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListingPage} from '../listing/listing';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

	public queryText: string;

  constructor(public navCtrl: NavController, 
  	public translate: TranslateService,
  	private storage: Storage) {

  	this.queryText = '';

  }

  goListing(){
  	this.navCtrl.push(ListingPage);
  }

  searchByKeyword(){
  	console.log(this.queryText);
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
