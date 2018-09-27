import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

import { DataService } from './app.data';

// import Parse from 'parse';
const Parse = require('parse');

@Component({
  templateUrl: 'app.html'
})
export class SmartieApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  buttons: Array<{ iconName: string, text: string, pageName: string, index?: number, pageTitle?: string, isTabs?: boolean }>;

  //private parseAppId: string = "80f6c155-d26e-4c23-a96b-007cb4cba8e1";
  private parseAppId: string = "948b9456-8c0a-4755-9e84-71be3723d338";
  private parseMasterKey: string = "49bc1a33-dfe7-4a32-bdcc-ee30b7ed8447"; // local and test
  //private parseServerUrl: string = "https://smartieapp.com/parse";
  private parseServerUrl: string = "https://test.t0tl3s.com/parse";
  // private parseServerUrl: string = "http://172.16.1.179:1337/parse";
  // private parseServerUrl: string = "http://76.170.58.147:1337/parse";

  constructor(
    public platform: Platform,
    public events: Events,
    public storage: Storage,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public geolocation: Geolocation,
    public firebase: Firebase,
    public device: Device,
    public dataService: DataService) {
    this.initializeApp();
    this.events.subscribe("buttonsLoad", eventData => {
      //Tabs index 0 is always set to search
      if (eventData !== 'teacher') {
        this.buttons = [
          { iconName: 'book', text: 'Manage Orders', pageName: ''},
          { iconName: 'qr-scanner', text: 'Scan QR Promo', pageName: '' },
          { iconName: 'settings', text: 'Profile Settings', pageName: 'EditProfilePage', index: 1, pageTitle: 'Edit User' },
          { iconName: 'paper', text: 'Give Feedback', pageName: 'FeedbackPage', isTabs:false  },
          { iconName: 'add-circle', text: 'Create a Job', pageName: '' },
          { iconName: 'log-out', text: 'Logout', pageName: '' }
        ];
      } else {
        this.buttons = [
          { iconName: 'card', text: 'Payment Details', pageName: 'PaymentDetailsPage', index: 1, pageTitle: 'Payment Options' },
          { iconName: 'card', text: 'Wallet', pageName: 'WalletPage' },
          { iconName: 'book', text: 'Manage Orders', pageName: '' },
          { iconName: 'qr-scanner', text: 'Scan QR Promo', pageName: '' },
          { iconName: 'settings', text: 'Profile Settings', pageName: 'EditProfilePage', index: 2, pageTitle: 'Edit User' },
          { iconName: 'paper', text: 'Give Feedback', pageName: 'FeedbackPage' },
          { iconName: 'log-out', text: 'Logout', pageName: '' }
        ];
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.initGeolocation();
        this.initFirebase(); // NB: calls sync/non-returning notificationHandler

        Parse._initialize(this.parseAppId, null, this.parseMasterKey);
       // Parse.initialize(this.parseAppId, null, this.parseMasterKey);
        Parse.serverURL = this.parseServerUrl;

        this.dataService.getApi(
          'getUserProvision',
          { uuid: this.device.uuid }
        ).then(API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
            this.storage.get('UserProfile').then(user => {
              console.log('And made it back with a UserProfile obj called user: '+JSON.stringify(user));
              if (user == null) {
                // hm, no UserProfile object but maybe there's a provision???
                // NB; we should not need this since it is accomodated for by the else below
                // in Registration object save logics
                // this.storage.get('Provision').then(async provision => {
                //
                // });

                console.log('Attempting to fetch Registration object in absence of UserProfile.');
                this.storage.get("Registration").then(registration => {
                  if(registration && registration.step){
                    console.log('Registration weirdness.');
                    if(registration.step === 0){
                      this.nav.setRoot("RegisterStep1Page", { role: registration.role });
                    }else if(registration.step == 1){
                      this.nav.setRoot("RegisterStep2Page", registration);
                    }else if(registration.step == 2){
                      this.nav.setRoot("RegisterStep3Page", registration);
                    }
                  }else{
                    // NB has a provision, but no User object and no saved reg, yuup sending them back through registration!
                    console.log('We likely have a provision, but no User or Registration objects, so are going to RegisterStep1 with role from: '+JSON.stringify(response));
                    this.nav.setRoot("RegisterStep1Page", { role: response.result.provision.role });
                  }
                  this.splashScreen.hide();
                }, err => {
                  console.log('Error getting Registration from storage: '+err);
                });
              } else {
                this.nav.setRoot("TabsPage", { tabIndex: 0, tabTitle: 'SmartieSearch', role: user.profileData.role });
                this.splashScreen.hide();
              }
            }, err => {
              console.log('Strange err: '+err);
            })
          }, err => {
            console.log('No provision from server (yet): '+JSON.stringify(err));
            this.splashScreen.hide();
            this.rootPage = 'LandingPage';
          })
        });
      } else {
        console.log('What on earth non-cordova land.');
        this.splashScreen.hide();
        this.rootPage = 'LandingPage';
      }
    });
  }

  initGeolocation() : Promise<any> {
    return new Promise((resolve, reject) => { // only returns promise for testing purpose
      this.geolocation.getCurrentPosition().then(resp => {
        this.storage.set('phoneGeoposition', resp).then(() => {
          resolve(resp);
        }, error => {
          console.info('Error storing phoneGeoposition: ', JSON.stringify(error));
          reject(error);
        });
      }, error => {
        console.info('Error setting phoneGeoposition: ', JSON.stringify(error));
        reject(error);
      });
    });
  }

  initFirebase() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebase.getToken().then(token => {
        //console.log(`Firebase token is: ${token}`);
        console.log('Going to updateFcmToken with: '+JSON.stringify(this.device));
        this.dataService.getApi(
          'updateFcmToken',
          {
            device: { cordova: this.device.cordova, isVirtual: this.device.isVirtual, manufacturer: this.device.manufacturer, model: this.device.model, platform: this.device.platform, serial: this.device.serial, uuid: this.device.uuid, version: this.device.version },
            token: token
          }
        ).then(API => {
          //console.log("API: "+JSON.stringify(API));
          //console.info("http.post from here is: "+this.dataService.http.post);
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(data => {
            this.notificationHandler();
            resolve(token);
          }, error => {
            console.info('Error in updateFcmToken endpoint: ', error);
            reject(error);
          });
        }, error => {
          console.info('Failed to get updateFcmToken API object: '+JSON.stringify(error));
          reject(error);
        });
      }, error => {
        console.info('Error in Firebase getToken: ', JSON.stringify(error));
        reject(error);
      });
    })
  }

  notificationHandler() : void {
    this.firebase.onNotificationOpen().subscribe((notification: any) => {
      //perform action based notification's action
      if (notification.eventAction == "PaymentReminder") {
        this.nav.push("AddPaymentPage");
      } else if (notification.eventAction == "JobRequest") {
        let job = JSON.parse(notification.extraData);
        this.dataService.getApi(
          'getJobRequestById',
          { "jobRequestId": job.jobId }
        ).then(API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
            this.nav.push("JobRequestPage", { params: response.result });
          }, err => {
            // TODO: handle this in UI
            console.info('0: '+err);
          })
        }, err => {
          console.info('sub-0: '+err);
        });
      }
    }, err => {
      // TODO: ditto
      console.info('1: '+err);
    });
  }

  pushPage(event, page) {
    if (page.iconName == 'log-out') { // logout -->
      this.storage.remove('UserProfile'); // yes??
       //this.dbservice.deleteUser();
      this.nav.setRoot("LoginPage"); // send to Login
      // NB: wait why are we doing this?
      //this.firebase.updateFcmToken(null, false);
    }else if(page.text == 'Wallet'){
      this.nav.push("WalletPage");
    }else{
      if(page.isTabs){
      this.storage.get("UserProfile").then(userProfile => {
        let params = {};

        // The index is equal to the order of our tabs inside tabs.ts
        if (page.index) {
          params = { tabIndex: page.index, tabTitle: page.pageTitle, role: userProfile.profileData.role };
        }

        this.nav.setRoot("TabsPage", params);
        // this.nav.setRoot(page.pageName);
      })
      }else{
        this.nav.push(page.pageName);
      }

    }
  }
    /*if (button.iconName == 'paper')
      this.nav.push("FeedbackPage");
    else if (button.iconName == 'settings')
      this.nav.setRoot("TabsPage", { tabIndex: 1} );
    else if (button.iconName == 'add-circle')
      this.nav.push("CreateJobPage");
    else if (button.iconName == 'card')
      this.nav.push("PaymentDetailsPage");
    else if (button.iconName == 'log-out') { // logout -->
      this.storage.clear(); // dump ephemeral session
      this.nav.setRoot("LoginPage"); // send to Login
    }*/
  //}
}
