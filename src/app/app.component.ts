import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SearchPage } from '../pages/search/search';
import { TranslateService } from '@ngx-translate/core';
import { AppRate } from '@ionic-native/app-rate';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { AuthServiceProvider } from '../providers/auth/auth';
import { ListingProvider } from '../providers/listing/listing';
import { ServiceProvider } from '../providers/service/service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Environment } from '@ionic-native/google-maps';
import { HotCodePush, HotCodePushRequestOptions } from '@ionic-native/hot-code-push';
import { FcmProvider } from '../providers/fcm/fcm';
import { DetailPage } from '../pages/detail/detail';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;
  private currentLang: any = 'kh';
  

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    translate: TranslateService,
    private storage: Storage,
    private auth: AuthServiceProvider,
    private serviceProvider: ServiceProvider,
    private screenOrientation: ScreenOrientation,
    private hotCodePush: HotCodePush,
    private alertCtrl: AlertController,
    private appRate: AppRate,
    private fcm: FcmProvider,
    private toastCtrl: ToastController,
    private listingProvider: ListingProvider) {

    splashScreen.show();
    this.auth.getRedirectResult();


    platform.ready().then(() => {

      this.fcm.getToken();

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          if(response.tap){
            
            

              let listingId = response['id'];
              this.listingProvider.getListing(listingId).then((listing) => {
                this.nav.push(DetailPage, {
                  listing: listing,
                  user_id: listing['user_id']
                });
              })
            
            
          }else{
            let toast = this.toastCtrl.create({
              message: response.title,
              duration: 3000
            });
            toast.present();
          }
        });
      }catch(err){
       
      }

      this.rateAuto();

      
      
      hotCodePush.fetchUpdate().then( async data => { 
        console.log('FETCH DATA', data);
        console.log('await hotCodePush.getVersionInfo()', await hotCodePush.getVersionInfo());
        if (data){
          this.presentAlert('Installing Update', 'Version '+ await hotCodePush.getVersionInfo());
          hotCodePush.installUpdate();
          hotCodePush.onUpdateInstalled().subscribe(() => {
            this.presentAlert('Update Done', 'Restarting application...');
          });  
        }
        else{
          this.presentAlert('No Update', 'Version '+await hotCodePush.getVersionInfo());
        }
        
      }).catch((error) => {
        console.error('ERROR FETCH', JSON.stringify(error));
      });

      if (document.URL.startsWith('https')){
        Environment.setEnv({
          API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBUuXZ2zRqiAzdOvSvc6YGN1odBEX3qyrw",
          API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBUuXZ2zRqiAzdOvSvc6YGN1odBEX3qyrw"
        });
      }

      statusBar.styleDefault();
      
      
      splashScreen.hide();  
      
      

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      translate.setDefaultLang(this.currentLang);
      this.serviceProvider.getLanguage().then((val) => {
        if (val){
          this.currentLang = val;
          translate.use(this.currentLang); 
        }
        else{
          this.serviceProvider.setLanguage(this.currentLang);
        }
        
      });
      

    });



  }

  presentAlert(title, msg) {
     const prompt = this.alertCtrl.create({
       title: title,
       message: msg,
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


  async rateAuto(){
    try {
        this.appRate.preferences = {
          displayAppName: 'Konleng - Real Estate App',
          usesUntilPrompt: 3,
          simpleMode: true,
          promptAgainForEachNewVersion: false,
          useCustomRateDialog: true,
          storeAppURL: {
            ios: '1440587029',
            android: 'market://details?id=com.konleng.app'
          },
          customLocale: {
            title: 'ចូលចិត្ត %@ ដែរទេ?',
            message: 'បើអ្នកចូលចិត្ត, ជួយដាក់ពិន្ទុអោយផង។ សូមអរគុណទុកជាមុន!',
            cancelButtonLabel: 'ទេ',
            laterButtonLabel: 'លើកក្រោយ',
            rateButtonLabel: 'ដាក់ពិន្ទុ'
          },
          callbacks: {
            onRateDialogShow: function(callback){
              
            },
            onButtonClicked: function(buttonIndex){
              
            }
          }
        };

        this.appRate.promptForRating(false);
    } catch(err){
        
       console.error(err);
    }
  }

  


}
