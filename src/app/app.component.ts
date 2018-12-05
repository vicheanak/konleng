import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SearchPage } from '../pages/search/search';
import { TranslateService } from '@ngx-translate/core';

import { Storage } from '@ionic/storage';

import { AuthServiceProvider } from '../providers/auth/auth';
import { ServiceProvider } from '../providers/service/service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  private currentLang: any = 'kh';
  

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    translate: TranslateService,
    private storage: Storage,
    private auth: AuthServiceProvider,
    private serviceProvider: ServiceProvider,
    private screenOrientation: ScreenOrientation) {



    platform.ready().then(() => {

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



    this.auth.afAuth.authState
    .subscribe(
      user => {
        if (user) {
          console.log('app.component.ts - user is logged in', user);
        } else {
          console.log('app.component.ts - not login');
        }
      },
      () => {
        console.log('app.component.ts - error login');
      });
  }

  


}
