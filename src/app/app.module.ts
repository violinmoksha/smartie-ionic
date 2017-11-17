import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
//import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// import { Auth } from '@ionic/cloud-angular';

import { MyApp } from './app.component';

//import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { Register } from '../pages/register/register';
import { RegisterTeacher } from '../pages/register/teacher/teacher';
import { RegisterTeacherStep2 } from '../pages/register/teacher-step2/teacher-step2';
import { RegisterTeacherStep3 } from '../pages/register/teacher-step3/teacher-step3';
import { RegisterStudent } from '../pages/register/student/student';
import { RegisterParent } from '../pages/register/parent/parent';
import { RegisterSchool } from '../pages/register/school/school';
import { Payment } from '../pages/payment/payment';
import { PaymentConfirm } from '../pages/payment/payment-confirm/payment-confirm';
import { PaymentThankyou } from '../pages/payment/payment-thankyou/payment-thankyou';
import { Login } from '../pages/login/login';
import { TotlesSearch } from '../pages/totles-search/totles-search';
import { TeacherJobAccepted } from '../pages/teacher-job-accepted/teacher-job-accepted';
import { AllAccepteds } from '../pages/all-accepteds/all-accepteds';
import { JobRequests } from '../pages/job-requests/job-requests';
import { CardPage } from '../pages/card/card';
import { Dashboard } from '../pages/dashboard/dashboard';
import { QrCodeScanner } from '../pages/qr-code-scanner/qr-code-scanner';
import { GoogleMaps } from '@ionic-native/google-maps';
/*
import { RegisterTeacher } from '../pages/register/teacher';
import { RegisterTeacherStep2 } from '../pages/register/teacher2';
import { RegisterTeacherStep3 } from '../pages/register/teacher3';
import { TeacherNotification } from '../pages/notification/teacher';
import { RegisterParentPage } from '../pages/register/parent';
import { RegisterSchoolPage } from '../pages/register/school';
import { StudentJobProfile } from '../pages/job/student';
import { SchoolJobProfile } from '../pages/job/school';
import { JobAccept } from '../pages/job/accept';
import { JobNotification } from '../pages/job/notification';
import { Reviews } from '../pages/reviews/reviews';
import { TotlesSearch } from '../pages/totles/search';
import { TotlesLogin } from '../pages/totles/login';
*/

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Camera } from '@ionic-native/camera';
//import { Geolocation } from '@ionic-native/geolocation';

import { ParseProvider } from '../providers/parse/parse';

import { IonicStorageModule } from '@ionic/storage';

import { Stripe } from '@ionic-native/stripe';

// AoT requires an exported function for factories
/*
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}
*/

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    Register,
    RegisterTeacher,
    RegisterTeacherStep2,
    RegisterTeacherStep3,
    RegisterStudent,
    RegisterParent,
    RegisterSchool,
    Payment,
    PaymentConfirm,
    PaymentThankyou,
    Login,
    TotlesSearch,
    TeacherJobAccepted,
    AllAccepteds,
    JobRequests,
    CardPage,
    Dashboard,
    QrCodeScanner/*,
    RegisterTeacherStep2,
    RegisterTeacherStep3,
    TeacherNotification,
    RegisterParent,
    RegisterSchool,
    StudentJob,
    SchoolJob,
    JobAccept,
    JobNotification,
    Reviews,
    TotlesSearch,
    TotlesLogin*/
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
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Register,
    RegisterTeacher,
    RegisterTeacherStep2,
    RegisterTeacherStep3,
    RegisterStudent,
    RegisterParent,
    RegisterSchool,
    Payment,
    PaymentConfirm,
    PaymentThankyou,
    Login,
    TotlesSearch,
    TeacherJobAccepted,
    AllAccepteds,
    JobRequests,
    CardPage,
    Dashboard,
    QrCodeScanner/*,
    RegisterTeacherStep2,
    RegisterTeacherStep3,
    TeacherNotification,
    RegisterParent,
    RegisterSchool,
    StudentJob,
    SchoolJob,
    JobAccept,
    JobNotification,
    Reviews,
    TotlesSearch,
    TotlesLogin*/
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    GoogleMaps,
    Stripe,
    // Auth,
    //Camera, // ???
    //Geolocation, // ???
    //Parse,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ParseProvider
  ]
})
export class AppModule {}
