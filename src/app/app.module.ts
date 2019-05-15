import { Constants } from './app.constants';
import { Device } from '@ionic-native/device';

// TODO: uncomment in prod with appropriate modification
//import { ErrorHandler, IonicErrorHandler, SmartieErrorHandler } from './app.err';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { SmartieApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Firebase } from '@ionic-native/firebase';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { CalendarModule } from "ion2-calendar";
import { Stripe } from '@ionic-native/stripe';
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';
import { IonicImageLoader } from 'ionic-image-loader';
import { Globalization } from '@ionic-native/globalization';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { AnalyticsProvider } from '../providers/analytics';
import { ContactPatterns } from '../providers/contact-patterns';
import { CameraServiceProvider } from '../providers/camera-service';
import { FileUploaderProvider } from '../providers/file-uploader';
import { FileTransfer } from '@ionic-native/file-transfer';
import { SecureStorage } from '@ionic-native/secure-storage';
import { HTTP } from '@ionic-native/http';
import { DataService } from './app.data';
import { ToasterServiceProvider } from '../providers/toaster-service';
import { FetchiOSUDID } from '../providers/fetch-ios-udid';
import { Network } from '@ionic-native/network'
import { FirebaseCrashlyticsProvider } from '../providers/firebase-crashlytics';
import { Crashlytics } from '@ionic-native/fabric';
import { SmartieErrorHandler } from './app.err';
import { UtilsProvider } from '../providers/utils';
import { JobRequestProvider } from '../providers/job-request';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AppRate } from '@ionic-native/app-rate';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
@NgModule({
  declarations: [
    SmartieApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(SmartieApp),
    IonicStorageModule.forRoot({
      name: 'smartiedb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    CalendarModule,
    BrowserAnimationsModule,
    TooltipsModule,
    IonicImageLoader.forRoot(),
    AngularFireModule.initializeApp(Constants.firebaseConfig.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmartieApp
  ],
  providers: [
    [{provide: ErrorHandler, useClass: SmartieErrorHandler}],
    StatusBar,
    SplashScreen,
    Geolocation,
    Stripe,
    Camera,
    ImagePicker,
    Push,
    Globalization,
    InAppBrowser,
    ThemeableBrowser,
    Firebase,
    Device,
    AnalyticsProvider,
    ContactPatterns,
    SecureStorage,
    FileTransfer,
    Constants,
    HTTP,
    DataService,
    CameraServiceProvider,
    FileUploaderProvider,
    ToasterServiceProvider,
    FetchiOSUDID,
    Network,
    FirebaseCrashlyticsProvider,
    Crashlytics,
    UtilsProvider,
    JobRequestProvider,
    LocationAccuracy,
    { provide: StorageBucket, useValue: 'smartie-212716.appspot.com' },
    AppRate,
    OpenNativeSettings
  ]
})
export class AppModule { }
