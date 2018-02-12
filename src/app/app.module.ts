// TODO: uncomment in prod with appropriate modification
//import { ErrorHandler, IonicErrorHandler, SmartieErrorHandler } from '../providers/err';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SmartieApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { CalendarModule } from "ion2-calendar";
import { Stripe } from '@ionic-native/stripe';
import { ParseProvider } from '../providers/parse';
import { SmartieAPI } from '../providers/api/smartie';
import { Globalization } from '@ionic-native/globalization';

@NgModule({
  declarations: [
    SmartieApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(SmartieApp),
    IonicStorageModule.forRoot(),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmartieApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    Camera,
    ParseProvider,
    SmartieAPI,
    Globalization,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
