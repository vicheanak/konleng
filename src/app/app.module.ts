import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FormsModule } from '@angular/forms';

import { SearchPage } from '../pages/search/search';
import { MePage } from '../pages/me/me';
import { ListingPage, FilterModal } from '../pages/listing/listing';
import { DetailPage } from '../pages/detail/detail';

import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { EditPage } from '../pages/edit/edit';
import { MyPropertiesPage } from '../pages/my-properties/my-properties';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { ProfilePage } from '../pages/profile/profile';
import { SavedPage } from '../pages/saved/saved';
import { SettingsPage } from '../pages/settings/settings';
import { TermsOfUsePage } from '../pages/terms-of-use/terms-of-use';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AddPage } from '../pages/add/add';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicStorageModule } from '@ionic/storage';


import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStepperModule } from 'ionic-stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    MePage,
    ListingPage,
    FilterModal,
    DetailPage,
    ChangePasswordPage,
    ConfirmationPage,
    ContactUsPage,
    EditPage,
    MyPropertiesPage,
    PrivacyPolicyPage,
    ProfilePage,
    SavedPage,
    SettingsPage,
    TermsOfUsePage,
    LoginPage,
    RegisterPage,
    AddPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    IonicStorageModule.forRoot({
      name: '__konleng',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicStepperModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
    loader: {
     provide: TranslateLoader,
     useFactory: (setTranslateLoader),
     deps: [HttpClient]
   }
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    MePage,
    ListingPage,
    FilterModal,
    DetailPage,
    ChangePasswordPage,
    ConfirmationPage,
    ContactUsPage,
    EditPage,
    MyPropertiesPage,
    PrivacyPolicyPage,
    ProfilePage,
    SavedPage,
    SettingsPage,
    TermsOfUsePage,
    LoginPage,
    RegisterPage,
    AddPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  // setTranslateLoader(http: HttpClient) {
  //   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // }
}

export function setTranslateLoader(http: HttpClient) {
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


