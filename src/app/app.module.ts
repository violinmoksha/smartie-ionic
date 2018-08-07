import { Device } from '@ionic-native/device';
// TODO: uncomment in prod with appropriate modification
import { ErrorHandler, IonicErrorHandler, SmartieErrorHandler } from '../providers/err';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { SmartieApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Firebase } from '@ionic-native/firebase';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { CalendarModule } from "ion2-calendar";
import { Stripe } from '@ionic-native/stripe';
import { ParseProvider } from '../providers/parse';
import { SmartieAPI } from '../providers/api/smartie';
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';
import { IonicImageLoader } from 'ionic-image-loader';
import { Globalization } from '@ionic-native/globalization';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { AnalyticsProvider } from '../providers/analytics/analytics';
import { ContactPatterns } from '../providers/contact-patterns';
import { CameraServiceProvider } from '../providers/camera-service/camera-service';

@NgModule({
  declarations: [
    SmartieApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(SmartieApp),
    IonicStorageModule.forRoot({
      name: 'smartiedb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    CalendarModule,
    BrowserAnimationsModule,
    TooltipsModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmartieApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Stripe,
    Camera,
    ImagePicker,
    ParseProvider,
    SmartieAPI,
    Push,
    IonicErrorHandler,
    Globalization,
    InAppBrowser,
    ThemeableBrowser,
    [{provide: ErrorHandler, useClass: SmartieErrorHandler}],
    Firebase,
    FirebaseProvider,
    Device,
    DbserviceProvider,
    AnalyticsProvider,
    ContactPatterns,
    CameraServiceProvider
  ]
})
export class AppModule {}
