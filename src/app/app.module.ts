// SmartieErrorHandler, must load first
import { ErrorHandler, IonicErrorHandler, SmartieErrorHandler } from '../providers/err';

// core app dependencies
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// pages
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
import { ForgotPassword } from '../pages/forgot-password/forgot-password';
import { TotlesSearch } from '../pages/totles-search/totles-search';
import { TeacherJobAccepted } from '../pages/teacher-job-accepted/teacher-job-accepted';
import { AllAccepteds } from '../pages/all-accepteds/all-accepteds';
import { ViewProfile } from '../pages/view-profile/view-profile';
import { JobRequests } from '../pages/job-requests/job-requests';
import { CardPage } from '../pages/card/card';
import { Language } from '../pages/language/language';
import { QrCodeScanner } from '../pages/qr-code-scanner/qr-code-scanner';
import { StarRatingModule } from 'angular-star-rating';
import { Reviews } from '../pages/reviews/reviews';
import { SetReview } from '../pages/reviews/set-review';

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
import { Push, PushObject } from '@ionic-native/push';
import { ParseProvider } from '../providers/parse';
import { SmartieAPI } from '../providers/api/smartie';
import {Push, PushObject, PushOptions} from "@ionic-native/push";

// translation helpers for v2
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
    ForgotPassword,
    TotlesSearch,
    Language,
    TeacherJobAccepted,
    AllAccepteds,
    ViewProfile,
    JobRequests,
    CardPage,
    Reviews,
    SetReview,
    QrCodeScanner
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
    ForgotPassword,
    TotlesSearch,
    Language,
    TeacherJobAccepted,
    AllAccepteds,
    ViewProfile,
    JobRequests,
    CardPage,
    Reviews,
    SetReview,
    QrCodeScanner
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
    Push,
    PushObject,
    // Errors
    IonicErrorHandler,
    Push,
    [{ provide: ErrorHandler, useClass: SmartieErrorHandler }]
  ]
})
export class AppModule {}
