import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//import { SmartieErrorHandler } from '../providers/err';

import { MyApp } from './app.component';

//import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { Register } from '../pages/register/register';
import { RegisterTeacher } from '../pages/register/teacher/teacher';
import { RegisterTeacherStep2 } from '../pages/register/teacher-step2/teacher-step2';
import { RegisterTeacherStep3 } from '../pages/register/teacher-step3/teacher-step3';
import { RegisterStudent } from '../pages/register/student/student';
import { RegisterStudentStep2 } from '../pages/register/student/student-step2/student-step2';
import { RegisterStudentStep3 } from '../pages/register/student/student-step3/student-step3';
import { RegisterParent } from '../pages/register/parent/parent';
import { RegisterParentStep2 } from '../pages/register/parent/parent-step2/parent-step2';
import { RegisterParentStep3 } from '../pages/register/parent/parent-step3/parent-step3';
import { RegisterSchool } from '../pages/register/school/school';
import { RegisterSchoolStep2 } from '../pages/register/school/school-step2/school-step2';
import { RegisterSchoolStep3 } from '../pages/register/school/school-step3/school-step3';
import { Payment } from '../pages/payment/payment';
import { PaymentConfirm } from '../pages/payment/payment-confirm/payment-confirm';
import { PaymentThankyou } from '../pages/payment/payment-thankyou/payment-thankyou';
import { Login } from '../pages/login/login';
import { TotlesSearch } from '../pages/totles-search/totles-search';
import { TeacherJobAccepted } from '../pages/teacher-job-accepted/teacher-job-accepted';
import { AllAccepteds } from '../pages/all-accepteds/all-accepteds';
import { ViewProfile } from '../pages/view-profile/view-profile';
import { JobRequests } from '../pages/job-requests/job-requests';
import { CardPage } from '../pages/card/card';
import { Language } from '../pages/language/language';
// import { Dashboard } from '../pages/dashboard/dashboard';
import { QrCodeScanner } from '../pages/qr-code-scanner/qr-code-scanner';
import { GoogleMaps } from '@ionic-native/google-maps';
import { StarRatingModule } from 'angular-star-rating';
import { Reviews } from '../pages/reviews/reviews';
import { SetReview } from '../pages/reviews/set-review';
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
import { Camera } from '@ionic-native/camera';
import { CalendarModule } from "ion2-calendar";
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { ParseProvider } from '../providers/parse';

import { IonicStorageModule } from '@ionic/storage';

import { Stripe } from '@ionic-native/stripe';
import { SmartieAPI } from '../providers/api/smartie';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

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
    RegisterStudentStep2,
    RegisterStudentStep3,
    RegisterParent,
    RegisterParentStep2,
    RegisterParentStep3,
    RegisterSchool,
    RegisterSchoolStep2,
    RegisterSchoolStep3,
    Payment,
    PaymentConfirm,
    PaymentThankyou,
    Login,
    TotlesSearch,
    Language,
    TeacherJobAccepted,
    AllAccepteds,
    ViewProfile,
    JobRequests,
    CardPage,
    // Dashboard,
    Reviews,
    SetReview,
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
    IonicStorageModule.forRoot(),
    StarRatingModule.forRoot(),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Register,
    RegisterTeacher,
    RegisterTeacherStep2,
    RegisterTeacherStep3,
    RegisterStudent,
    RegisterStudentStep2,
    RegisterStudentStep3,
    RegisterParent,
    RegisterParentStep2,
    RegisterParentStep3,
    RegisterSchool,
    RegisterSchoolStep2,
    RegisterSchoolStep3,
    Payment,
    PaymentConfirm,
    PaymentThankyou,
    Login,
    TotlesSearch,
    Language,
    TeacherJobAccepted,
    AllAccepteds,
    ViewProfile,
    JobRequests,
    CardPage,
    // Dashboard,
    Reviews,
    SetReview,
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
    Camera,
    Geolocation,
    NativeGeocoder,
    //Parse,
    ParseProvider,
    // API
    SmartieAPI,
    // Errors
    //IonicErrorHandler,
    //[{ provide: ErrorHandler, useClass: SmartieErrorHandler }]
  ]
})
export class AppModule {}
