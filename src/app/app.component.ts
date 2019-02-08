import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, Tabs, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

import { DataService } from './app.data';
import { ToasterServiceProvider } from '../providers/toaster-service';
import { FetchiOSUDID } from '../providers/fetch-ios-udid';
import { ImagePicker } from '@ionic-native/image-picker';
import { FirebaseCrashlyticsProvider } from '../providers/firebase-crashlytics';
import { UtilsProvider } from '../providers/utils';

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
  public userName: String;
  public roleColor: String;
  public role: String;

  constructor(
    public platform: Platform,
    public events: Events,
    public storage: Storage,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public geolocation: Geolocation,
    public firebase: Firebase,
    public device: Device,
    public dataService: DataService,
    public tosterService: ToasterServiceProvider,
    public imagePicker: ImagePicker,
    public fetchiOSUDID: FetchiOSUDID,
    public crashlytics: FirebaseCrashlyticsProvider,
    private utilsService: UtilsProvider) {
    this.dataService.currentPage = "Root"
    this.initializeApp();
    this.events.subscribe("buttonsLoad", eventData => {
      //Tabs index 0 is always set to search
      if (eventData !== 'teacher') {
        this.buttons = [
          { iconName: 'book', text: 'Manage Orders', pageName: '' },
          { iconName: 'qr-scanner', text: 'Scan QR Promo', pageName: '' },
          { iconName: 'settings', text: 'Profile Settings', pageName: 'EditProfilePage', index: 1, pageTitle: 'Edit User' },
          { iconName: 'paper', text: 'Give Feedback', pageName: 'FeedbackPage', isTabs: false },
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

    this.events.subscribe("login", () => {
      this.setUserName();
      // this.utilsService.getSelectedCity();
    })

  }

  ionViewDidLoad() {
    console.log("App loaded");
  }

  setUserName() {
    this.storage.get('UserProfile').then(user => {
      if (user && user.profileData) {
        this.userName = user.profileData.fullname
        this.roleColor = user.profileData.role == 'teacher' ? '#00BC5B' : '#0096D7';
        this.role = user.profileData.role;
        this.crashlytics.setUserInfo(user.profileData);
      } else {
        this.userName = "Smartie"
        this.roleColor = 'black';
        this.role = "student"
      }
    })
  }

  initializeAppInner(UDID) {
    this.dataService.getApi(
      'getUserProvision',
      { uuid: UDID }
    ).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
        this.storage.set("Provision", response.result);
        this.storage.get('UserProfile').then(user => {
          if (user == null) {
            //NOTE: if the provision 'reponse' has user n profile will redirect user to login
            if (response.result.provision.user && response.result.provision.profile) {
              this.nav.setRoot("LoginPage", { role: response.result.provision.role });
              this.splashScreen.hide();
            } else {
              this.storage.get("Registration").then(async registration => {
                if (registration && registration.step) {
                  if (registration.step === 0) {
                    this.nav.setRoot("RegisterStep1Page", { role: registration.role });
                  } else if (registration.step == 1) {
                    this.nav.setRoot("RegisterStep2Page", registration);
                  } else if (registration.step == 2) {
                    this.nav.setRoot("RegisterStep3Page", registration);
                  }
                } else {
                  // NB has a provision, but no User object and no saved reg, yuup sending them back through registration!
                  this.nav.setRoot("RegisterStep1Page", { role: response.result.provision.role });
                }
                this.splashScreen.hide();
              }, err => {
                console.log(err);
              });
            }
          } else {
            this.nav.setRoot("TabsPage", { tabIndex: 0, tabTitle: 'SmartieSearch', role: user.profileData.role });
            this.splashScreen.hide();
          }
        }, err => {
          console.log('Strange err: ' + err);
        })
      }, err => {
        console.log('No provision from server (yet): ' + JSON.stringify(err));
        this.splashScreen.hide();
        this.rootPage = 'LandingPage';
      })
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        // this.statusBar.styleDefault();
        this.statusBar.styleLightContent();
        this.initGeolocation();
        this.tosterService.internetListener();
        this.setUserName();
        this.utilsService.getSelectedCity();
        this.grantNotificationPermission();

        Parse._initialize(this.parseAppId, null, this.parseMasterKey);
        // Parse.initialize(this.parseAppId, null, this.parseMasterKey);
        Parse.serverURL = this.parseServerUrl;

        if (this.platform.is('ios')) {
          this.fetchiOSUDID.fetch().then(iOSUDID => {
            this.initFirebase(iOSUDID); // NB: calls sync/non-returning notificationHandler
            this.initializeAppInner(iOSUDID);
            this.onFcmTokenRefresh(iOSUDID);
          });
        } else {
          // android, persistant UDID
          this.initFirebase(this.device.uuid);
          this.initializeAppInner(this.device.uuid);
          this.onFcmTokenRefresh(this.device.uuid);
        }
      } else {
        console.log('What on earth non-cordova land.');
        this.splashScreen.hide();
        this.rootPage = 'LandingPage';
      }
    });
  }

  getGalleryPermission() {
    console.log("permision for Gallery");
    this.imagePicker.requestReadPermission();
  }

  initGeolocation(): Promise<any> {
    return new Promise((resolve, reject) => { // only returns promise for testing purpose
      this.geolocation.getCurrentPosition().then(resp => {
        this.storage.set('phoneGeoposition', resp).then(() => {
          resolve(resp);
        }, error => {
          console.info('Error storing phoneGeoposition: ', JSON.stringify(error));
          reject(error);
        });
        this.getGalleryPermission(); //For asking permision one by one;
      }, error => {
        console.info('Error setting phoneGeoposition: ', JSON.stringify(error));
        reject(error);
        this.getGalleryPermission();
      });
    });
  }

  grantNotificationPermission() {
    if(this.platform.is("ios")){
      this.firebase.grantPermission();
    }
  }

  onFcmTokenRefresh(udid) {
    this.firebase.onTokenRefresh().subscribe(newToken => {
      this.updateFcmtoServer(newToken, udid);
    })
  }

  updateFcmtoServer(token, UDID) {
    return new Promise((resolve, reject) => {
      this.dataService.getApi(
        'updateFcmToken',
        {
          device: { cordova: this.device.cordova, isVirtual: this.device.isVirtual, manufacturer: this.device.manufacturer, model: this.device.model, platform: this.device.platform, serial: this.device.serial, uuid: UDID, version: this.device.version },
          token: token
        }
      ).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(data => {
          this.notificationHandler();
          resolve(token);
        }, error => {
          console.info('Error in updateFcmToken endpoint: ', error);
          reject(error);
        });
      }, error => {
        console.info('Failed to get updateFcmToken API object: ' + JSON.stringify(error));
        reject(error);
      });
    })
  }

  initFirebase(UDID): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebase.getToken().then(token => {
        this.updateFcmtoServer(token, UDID).then(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      }, error => {
        console.info('Error in Firebase getToken: ', JSON.stringify(error));
        reject(error);
      });
    })
  }

  notificationHandler(): void {
    var notificationId = "0";
    this.firebase.onNotificationOpen().subscribe((notification: any) => {
      //perform action based notification's action
      console.log("Received chat notification");
      console.log(notification);

      var actionHandler = () => { //NB: To reuse this function due to ios triggers event twice
        if (notification.eventAction == "PaymentReminder") {
          this.nav.push("AddPaymentPage");
        } else if (notification.eventAction == "JobRequest") {
          if(notification.tap || notification.tap == 1){ //App in background
            this.pushJobRequestPage(notification);
          }else{
            if(this.dataService.currentPage == "NotificationFeedPage"){
              if (this.role == 'teacher')
                this.nav.setRoot("TabsPage", { tabIndex: 4, tabTitle: 'Notifications', role: this.role });
              else
                this.nav.setRoot("TabsPage", { tabIndex: 3, tabTitle: 'Notifications', role: this.role });
            }else{
              let toasterTitle = this.platform.is('ios') ? notification.aps.alert.body : notification.body;
              this.tosterService.chatToast(toasterTitle, "Go", () => {
                this.pushJobRequestPage(notification);
              });
            }
          }

        } else if (notification.eventAction == "MESSAGE_RECEIVED") {
          if (notification.tap || notification.tap == 1) { //App in background
            if (this.role == 'teacher')
              this.nav.setRoot("TabsPage", { tabIndex: 4, tabTitle: 'Messsages', role: this.role });
            else
              this.nav.setRoot("TabsPage", { tabIndex: 3, tabTitle: 'Messsages', role: this.role });
          } else {
            console.log(this.nav.getActive().name);
            // var appUrl = document.URL.toString(); NB: Not providing exact page location

            if (this.dataService.currentPage == "ChatPage")
              this.events.publish("pullMessage", notification);
            else {
              let toasterTitle = this.platform.is('ios') ? notification.aps.alert.title : notification.title;
              this.tosterService.chatToast(toasterTitle, "Go", () => {
                console.log("goto chat page");
                this.nav.push("ChatPage", { from: "toaster", jobObject:"", receiver:"", sender:"", notification: notification });
              })
            }
          }
        }
      }

      if (this.platform.is("ios")) {
        if (notification["gcm.message_id"] == notificationId) {
          notificationId = notification["gcm.message_id"];
          return false;
        } else {
          actionHandler();
          notificationId = notification["gcm.message_id"];
        }
      } else {
        actionHandler();
      }
    }, err => {
      // TODO: ditto
      console.info('1: ' + err);
    });
  }


  pushJobRequestPage(notification){
    let job = JSON.parse(notification.extraData);
    this.dataService.getApi(
      'getJobRequestById',
      { "jobRequestId": job.jobId }
    ).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
        if(response.result.acceptState == true){
          response.result.fromWhere = "acceptedJobs";
          response.result.role = "teacher";
        }else if(response.result.requestSent == true){
          response.result.fromWhere = "requestSentJobs";
        }
        this.nav.push("JobRequestPage", { params: response.result });
      }, err => {
        // TODO: handle this in UI
        console.info('0: ' + err);
      })
    }, err => {
      console.info('sub-0: ' + err);
    });
  }


  pushPage(event, page) {
    if (page.iconName == 'log-out') { // logout -->
      console.log("Remove user profile in logout");
      // this.logOutUser();
      this.storage.remove('UserProfile'); // yes??
      //this.dbservice.deleteUser();
      this.nav.setRoot("LoginPage"); // send to Login
      // NB: wait why are we doing this?
      //this.firebase.updateFcmToken(null, false);
    } else if (page.text == 'Wallet') {
      this.nav.push("WalletPage");
    } else {
      if (page.isTabs) {
        this.storage.get("UserProfile").then(userProfile => {
          let params = {};

          // The index is equal to the order of our tabs inside tabs.ts
          if (page.index) {
            params = { tabIndex: page.index, tabTitle: page.pageTitle, role: userProfile.profileData.role };
          }

          this.nav.setRoot("TabsPage", params);
        })
      } else {
        this.nav.push(page.pageName);
      }
    }
  }

  logOutUser(){
    return new Promise(async(resolve, reject) => {
      this.storage.get("UserProfile").then(async userProfile => {
        console.log(userProfile);
        return await this.dataService.getApi(
          'logoutUser',
          { sessionToken: userProfile.userData.sessionToken },
        ).then(async API => {
          console.log("******* API DATA ********")
          console.log(API);
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async logoutData => {
            console.log("********** logout data ***********");
            console.log(logoutData);
            if(logoutData){
              this.storage.remove('UserProfile');
              this.nav.setRoot("LoginPage");
            }
          })
        })
      });
    })
  }
}
