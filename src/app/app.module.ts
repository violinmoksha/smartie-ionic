// SmartieErrorHandler, must load first for Monitoring
import { ErrorHandler, IonicErrorHandler, SmartieErrorHandler } from '../providers/err';

// core app dependencies
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SmartieApp } from './app.component';

// providers: @ionic-native plugins + custom
import { GoogleMaps } from '@ionic-native/google-maps';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { CalendarModule } from "ion2-calendar";
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Globalization } from '@ionic-native/globalization';
import { IonicStorageModule } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
//import { Push, PushObject } from '@ionic-native/push';
import { ParseProvider } from '../providers/parse';
import { SmartieAPI } from '../providers/api/smartie';
import { StarRatingModule } from 'angular-star-rating';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    SmartieApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    IonicModule.forRoot(SmartieApp),
    IonicStorageModule.forRoot(),
    StarRatingModule.forRoot(),
    CalendarModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmartieApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    GoogleMaps,
    Stripe,
    Camera,
    NativeGeocoder,
    Globalization,
    ParseProvider,
    SmartieAPI,
    //Push,
    //PushObject,
    // Errors
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: SmartieErrorHandler }]
  ]
})
export class AppModule {}
