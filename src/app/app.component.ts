import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ParseProvider } from '../providers/parse';

//import { Language } from '../pages/language/language';
import { Feedback } from '../pages/feedback/feedback';
import { EditProfile } from '../pages/edit-profile/edit-profile';
import { Login } from '../pages/login/login';

//import { RegisterTeacherStep3 } from '../pages/register/teacher-step3/teacher-step3';

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

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private translate: TranslateService, public parseProvider: ParseProvider) {
    this.platform = platform;
    this.initializeApp();

    this.storage.get('sessionToken').then((val) => {
     if(val !== 'undefined'){
       this.rootPage = Login;
     }else{
       this.rootPage = Login;
     }
     // TODO @john: any time u need to fix a specific page UI
     // just uncomment the following line and recomment the above logic
     //this.rootPage = RegisterTeacherStep3;
    })

    this.translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }

      // init Push, see https://ionicframework.com/docs/native/push/
      // to check if we have permission
      /*this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

      // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
      this.push.createChannel({
       id: "testchannel1",
       description: "My first test channel",
       // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
       importance: 3
      }).then(() => console.log('Channel created'));

      // Delete a channel (Android O and above)
      //this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

      // Return a list of currently configured channels
      this.push.listChannels().then((channels) => console.log('List of channels', channels))

      // to initialize push notifications

      const options: PushOptions = {
         android: { senderID: "smartie"},
         ios: {
             alert: 'true',
             badge: true,
             sound: 'false'
         },
         windows: {},
         browser: {
             pushServiceURL: 'http://push.api.phonegap.com/v1/push'
         }
      };

      const pushObject: PushObject = this.push.init(options);

      pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

      pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

      */

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

  pushPage(item) {
    if (item == 'feedback')
      this.nav.push(Feedback);
    else if (item == 'edit-profile')
      this.nav.push(EditProfile);
    else if (item == 'login') { // logout -->
      localStorage.clear(); // dump session
      this.nav.push(Login); // send to Login
    }
  }
}
