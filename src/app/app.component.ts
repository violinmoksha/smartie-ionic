import { DbserviceProvider } from './../providers/dbservice/dbservice';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SmartieAPI } from '../providers/api/smartie';
import { Geolocation } from '@ionic-native/geolocation';
import { ParseProvider } from '../providers/parse';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { GetProvision } from '../providers/data-model/data-model';
import { SmartieSearch } from '../pages/smartie-search/smartie-search';
// NB: leaving here for demo in constructor
// TODO: put this in a proper Unit Test since it doesnt belong in app.component.ts
import { ContactPatterns } from '../providers/contact-patterns';

@Component({
  templateUrl: 'app.html'
})
export class SmartieApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  buttons: Array<{ iconName: string, text: string, pageName: string, index?: number, pageTitle?: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar,  private storage: Storage, public events: Events, public smartieApi: SmartieAPI, private geolocation: Geolocation, private parseProvider: ParseProvider,private firebase:FirebaseProvider, private device:Device, private http:HttpClient, private dbservice:DbserviceProvider, public contactPatterns:ContactPatterns, public splashScreen : SplashScreen) {

    this.initializeApp();

    // NB: Demo for catching PMs attempting to transmit contact info
    this.contactPatterns.allowedInput("my email at Dot COM").then(yesNo => {
      console.log('ContactPatterns: '+yesNo);
    });

    /*this.storage.get('sessionToken').then(val => {
      if (val !== 'undefined') {
        this.rootPage = "LoginPage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
    this.rootPage = "EditUserComponent";*/
    //this.rootPage = "LoginPage"; // send to Login

    this.events.subscribe("buttonsLoad", eventData => {
      //Tabs index 0 is always set to search
      if (eventData !== 'teacher') {
        this.buttons = [
          { iconName: 'book', text: 'Manage Orders', pageName: '' },
          { iconName: 'qr-scanner', text: 'Scan QR Promo', pageName: '' },
          { iconName: 'settings', text: 'Profile Settings', pageName: 'EditProfilePage', index: 1, pageTitle: 'Edit User' },
          { iconName: 'paper', text: 'Give Feedback', pageName: 'FeedbackPage' },
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
        console.log("device id");
        console.log(this.device.uuid);
        this.initGeolocation();
        this.firebase.initFCM();
        this.firebase.notificationListener();
        this.statusBar.styleDefault();
        // this.initPushNotifications();
       // this.rootPage = 'LauncherPage';

        let params = {
          "uuid":this.device.uuid,
        }

        return new Promise(async (resolve) => {
          let API = await this.smartieApi.getApi(
            'getUserProvision',
            params
          );

          this.smartieApi.http.post<GetProvision>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe((result) => {
            this.storage.set("Provision", result.result);
            this.storage.get('UserProfile').then((data)=>{
              if(data!=null){
                this.nav.setRoot("TabsPage", { tabIndex: 0, tabTitle: 'SmartieSearch', role: data.profileData.role });
              }else{
                this.dbservice.getRegistrationData().then((registration)=>{
                  if(registration){
                    if(registration.step === 0){
                      this.nav.setRoot("RegisterStep1Page", { role: registration.role });
                    }else if(registration.step == 1){
                      this.nav.setRoot("RegisterStep2Page", { role: registration.role });
                    }else if(registration.step == 2){
                      this.nav.setRoot("RegisterStep3Page", registration);
                    }
                  }else{
                    this.nav.setRoot("RegisterStep1Page", { role: result.result.provision.role });
                  }
                })
              }
              this.splashScreen.hide();
            })
          }, (err)=>{
            this.splashScreen.hide();
            this.rootPage = 'LandingPage';
          })
        })
      } else {
        this.rootPage = 'LandingPage';
      }

      this.parseProvider.parseInitialize();
    });
  }

  initGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Getting geo location");
      console.log(resp);
      let phoneLatLng = { latitude: resp.coords.latitude, longitude: resp.coords.longitude };
      console.log('phoneLatLng: '+JSON.stringify(phoneLatLng));
      this.storage.set('phoneLatLng', phoneLatLng);
      this.storage.set('currentPosition', resp);
    }).catch((error) => {
      console.log('Error getting phone location', JSON.stringify(error));
    });
  }
  //senderID: '187672812179'

  // initPushNotifications() {
  //   const options: PushOptions = {
  //     android: {
  //     },
  //     ios: {
  //       alert: 'true',
  //       badge: false,
  //       sound: 'true'
  //     },
  //     windows: {}
  //   };
  //   const pushObject: PushObject = this.push.init(options);

  //   pushObject.on('registration').subscribe((data: any) => {
  //     console.log('device token -> ' + data.registrationId);
  //     //TODO - send device token to server
  //     return new Promise(resolve => {
  //       let API = this.smartieApi.getApi(
  //         'sendAndroidPush',
  //         { deviceId: data.registrationId }
  //       );
  //       interface Response {};
  //       this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
  //         console.log(JSON.stringify(response));
  //       }, err => {
  //         console.log(err);
  //       })
  //     })
  //   });

  //   pushObject.on('notification').subscribe((data: any) => {
  //     console.log('message -> ' + data.message);
  //     //if user using app and push notification comes
  //     if (data.additionalData.foreground) {
  //       // if application open, show popup
  //       // let confirmAlert = this.alertCtrl.create({
  //       //   title: 'New Notification',
  //       //   message: data.message,
  //       //   buttons: [{
  //       //     text: 'Ignore',
  //       //     role: 'cancel'
  //       //   }, {
  //       //     text: 'View',
  //       //     handler: () => {
  //       //       //TODO: Your logic here
  //       //       this.nav.push("JobRequestPage", { message: data.message });
  //       //     }
  //       //   }]
  //       // });
  //       // confirmAlert.present();
  //     } else {
  //       //if user NOT using app and push notification comes
  //       //TODO: Your logic on click of push notification directly
  //       this.nav.push("JobRequestPage", { message: data.message });
  //       console.log('Push notification clicked');
  //     }
  //   });

  //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  // }

  pushPage(event, page) {
    if (page.iconName == 'log-out') { // logout -->
       this.dbservice.deleteUser();
      this.nav.setRoot("LoginPage"); // send to Login
      this.firebase.updateFcmToken(null, false);
    }else if(page.text == 'Wallet'){
      this.nav.push("WalletPage");
    }else{
      console.log(page);
      this.storage.get("UserProfile").then(userProfile => {
        let params = {};

        // The index is equal to the order of our tabs inside tabs.ts
        if (page.index) {
          params = { tabIndex: page.index, tabTitle: page.pageTitle, role: userProfile.profileData.role };
        }

        this.nav.setRoot("TabsPage", params);
        // this.nav.setRoot(page.pageName);
      })
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
  }
}
