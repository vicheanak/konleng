import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ConfirmationPage } from '../confirmation/confirmation';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 @Component({
 	selector: 'page-add',
 	templateUrl: 'add.html',
 })
 export class AddPage {

 	private actionSheetButtons = [];
 	private actionSheetTitle: string;

 	@ViewChild('descriptionInput') myInput: ElementRef;

 	constructor(
 		public translate: TranslateService,
 		private storage: Storage,
 		public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
 	}


 	resize() {
 		var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
 		var scrollHeight = element.scrollHeight;
 		element.style.height = scrollHeight + 'px';
 		this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
 	}

 	addImage(id: null) {
 		this.actionSheetButtons = [
 		{
 			text: 'Camera',
 			handler: () => {
 				console.log('Archive clicked');
 			}
 		},{
 			text: 'Gallery',
 			handler: () => {
 				console.log('Archive clicked');
 			}
 		}
 		];

 		this.actionSheetTitle = 'Add Image';

 		if (id){
 			this.actionSheetTitle = 'Edit Image';
 			this.actionSheetButtons.push({
 				text: 'Delete',
 				role: 'destructive',
 				handler: () => {
 					console.log('Destructive clicked');
 				}
 			});
 		}
 		

 		const actionSheet = this.actionSheetCtrl.create({
 			title: this.actionSheetTitle,
 			buttons: this.actionSheetButtons
 		});

 		actionSheet.present();
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad AddPage');
 	}

 	selectChange(e) {
 		console.log(e);
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

 	submit(){
 		this.navCtrl.setRoot(ConfirmationPage);
 	}

 }
