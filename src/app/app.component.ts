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
import { Environment } from '@ionic-native/google-maps';
import { Pro } from '@ionic/pro';

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

    this.auth.getRedirectResult();
    splashScreen.show();
    this.configureDeploy();
    this.performAutomaticUpdate();

    platform.ready().then(() => {



      if (document.URL.startsWith('https')){
        Environment.setEnv({
          API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBUuXZ2zRqiAzdOvSvc6YGN1odBEX3qyrw",
          API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBUuXZ2zRqiAzdOvSvc6YGN1odBEX3qyrw"
        });
      }

      statusBar.styleDefault();
      
      setTimeout(() => {
        splashScreen.hide();  
      }, 100);
      

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

  async configureDeploy() {
    const config = {
      'appId': 'f30489f0',
      'channel': 'Master'
    }
    await Pro.deploy.configure(config);
  }

  async performAutomaticUpdate() {
    try {
      const currentVersion = await Pro.deploy.getCurrentVersion();
      const resp = await Pro.deploy.sync({updateMethod: 'auto'});
      if (currentVersion.versionId !== resp.versionId){
        console.log('We found an update, and are in process of redirecting you since you put auto!');
        // We found an update, and are in process of redirecting you since you put auto!
      }else{
        // No update available
        console.log('No update available');
      }
    } catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:
      console.error('Error update', err);
      Pro.monitoring.exception(err);
    }
  }
  


}
