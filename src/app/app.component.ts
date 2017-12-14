import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Payment } from '../pages/payment/payment';
import { QrCodeScanner } from '../pages/qr-code-scanner/qr-code-scanner';
import { Language } from '../pages/language/language';
import { Login } from '../pages/login/login';
/*
import { RegisterTeacher } from '../pages/register/teacher';
import { RegisterTeacherStep2 } from '../pages/register/teacher2';
import { RegisterTeacherStep3 } from '../pages/register/teacher3';
import { TeacherNotification } from '../pages/notification/teacher';
import { RegisterParent } from '../pages/register/parent';
import { RegisterStudent } from '../pages/register/student';
import { RegisterSchool } from '../pages/register/school';
import { StudentJob } from '../pages/job/student';
import { SchoolJob } from '../pages/job/school';
import { JobAccept } from '../pages/job/accept';
import { JobNotification } from '../pages/job/notification';
import { Reviews } from '../pages/reviews/reviews';
import { TotlesSearch } from '../pages/totles/search';
import { TotlesLogin } from '../pages/totles/login';
*/

import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private translate: TranslateService) {
    this.platform = platform;
    this.initializeApp();

    this.storage.get('sessionToken').then((val) => {
     if(val !== 'undefined'){
       this.rootPage = Login;
     }else{
       this.rootPage = Login;
     }
    })

    this.translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Parse.initialize("948b9456-8c0a-4755-9e84-71be3723d338", "49bc1a33-dfe7-4a32-bdcc-ee30b7ed8447");
      //Parse.serverURL = 'https://test.t0tl3s.com/parse';

      // this.translate.setDefaultLang('en');

      // test
      //this.storage.set('userLang', 'th');

      //Commenting TranslateModule
      /*this.storage.get('userLang').then((val) => {
        this.translate.use(val);
      }).catch((err) => {
        this.translate.use('en');
      });*/

      /* document.addEventListener("deviceready", function() {
        console.log(navigator.globalization);

        // check out the device for lang
        if (navigator.globalization !== undefined) {
          navigator.globalization.getPreferredLanguage(function(language) {
            this.translate.use(language.value.split("-")[0]).then((data) => {
              console.log("SUCCESS -> " + data);
            }, (error) => {
              console.log("ERROR -> " + error);
            });
          }, null);
        }
      }, false); */

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  pushPage(item){
    if(item == 'language')
      this.nav.push(Language);
    if(item == 'payment')
      this.nav.push(Payment);
    if(item == 'qrcode')
      this.nav.push(QrCodeScanner);
  }
}
