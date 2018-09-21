// import { Response } from '@angular/http';
//import { DbserviceProvider } from './../providers/dbservice';
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


  async initializeApp() { // async for testing-purposes
    return await this.platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.initGeolocation();
        this.initFirebase(); // NB: calls sync/non-returning notificationHandler

Parse._initialize(this.parseAppId, null, this.parseMasterKey);
       // Parse.initialize(this.parseAppId, null, this.parseMasterKey);
        Parse.serverURL = this.parseServerUrl;

        return await this.dataService.getApi(
          'getUserProvision',
          { uuid: this.device.uuid }
        ).then(async API => {
          return await this.dataService.httpPost(API.apiUrl, API.apiBody, API.apiHeaders).then(async response => {
            this.storage.set("Provision", response.data.result);
            return await this.storage.get('UserProfile').then(async user => {
              if (user != null) {
                this.nav.setRoot("TabsPage", { tabIndex: 0, tabTitle: 'SmartieSearch', role: user.profileData.role });
                this.splashScreen.hide();
                return await true;
              } else {
                // hm, no UserProfile object but maybe there's a provision???
                // this.storage.get('Provision').then(async provision => {
                //
                // });
                if(response.data.result.provision.user && response.data.result.provision.profile){
                  this.nav.setRoot("LoginPage", { role: response.data.result.provision.role });
                  this.splashScreen.hide();
                  return true;
                }else{
                  return await this.storage.get("Registration").then(async registration => {
                    if(registration && registration.step){
                      if(registration.step === 0){
                        this.nav.setRoot("RegisterStep1Page", { role: registration.role });
                      }else if(registration.step == 1){
                        this.nav.setRoot("RegisterStep2Page", registration);
                      }else if(registration.step == 2){
                        this.nav.setRoot("RegisterStep3Page", registration);
                      }
                    }else{
                      // NB has a provision, but no User object and no saved reg, yuup sending them back through registration!
                      this.nav.setRoot("RegisterStep1Page", { role: response.data.result.provision.role });
                    }
                    this.splashScreen.hide();
                    return await true;

                  }, err => {
                    console.log(err);
                  });
                }

              }
            }, err => {
              console.log('Strange err: '+err);
            })
          }, err => {
            console.log('No provision from server (yet): '+JSON.stringify(err));
            this.splashScreen.hide();
            this.rootPage = 'LandingPage';
            return false;
          })
        });
      } else {
        console.log('What on earth non-cordova land.');
        this.splashScreen.hide();
        this.rootPage = 'LandingPage';
        return await false;
      }
    });
  }

  async initGeolocation() {
    return await this.geolocation.getCurrentPosition().then(async resp => {
      this.storage.set('phoneGeoposition', resp);
      return await resp;
    }, async error => {
      console.info('Error setting phoneGeoposition: ', JSON.stringify(error));
      return await error;
    });
  }

  async initFirebase() {
    let self = this;
     this.firebase.getToken().then(async token => {
      let API = await this.dataService.getApi(
        'updateFcmToken',
        { device: this.device, token: token }
      )
         self.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(data => {
          this.notificationHandler();
          return token;
        }, error => {
          console.info('Error in updateFcmToken endpoint: ', error);
          return error;
        });
    }, async error => {
      console.info('Error in Firebase getToken: ', JSON.stringify(error));
      return error;
    });
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
          this.dataService.httpPost(API.apiUrl, API.apiBody, API.apiHeaders).then(response => {
            this.nav.push("JobRequestPage", { params: response.data.result });
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
