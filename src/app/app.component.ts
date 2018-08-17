import { DbserviceProvider } from './../providers/dbservice/dbservice';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../providers/api/smartie';
import { Geolocation } from '@ionic-native/geolocation';
import { ParseProvider } from '../providers/parse';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { GetProvision } from '../providers/data-model/data-model';
import { SmartieSearch } from '../pages/smartie-search/smartie-search';

@Component({
  templateUrl: 'app.html'
})
export class SmartieApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  buttons: Array<{ iconName: string, text: string, pageName: string, index?: number, pageTitle?: string, isTabs?: boolean }>;

  constructor(public platform: Platform, public statusBar: StatusBar,  private storage: Storage, public events: Events, public smartieApi: SmartieAPI, private geolocation: Geolocation, private parseProvider: ParseProvider,private firebase:FirebaseProvider, private device:Device, private http:HttpClient, private dbservice:DbserviceProvider, public splashScreen : SplashScreen) {

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

        // for testing only
        /*
        this.dbservice.getUserkey().then(data => {
          console.log('smartieKeys return: '+data);
        }, error => {
          console.log('smartieKeys return in err: '+error);
        })*/

        return new Promise(async (resolve) => {
          let API = await this.smartieApi.getApi(
            'getUserProvision',
            params
          );

          this.smartieApi.http.post<GetProvision>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe((result) => {
            console.log('got to api');
            this.storage.set("Provision", result.result);
              this.storage.get('UserProfile').then((data)=>{
                if(data!=null){
                  this.nav.setRoot("TabsPage", { tabIndex: 0, tabTitle: 'SmartieSearch', role: data.profileData.role });
                }else{
                  if(result.result.provision.user && result.result.provision.profile){
                    this.nav.setRoot("LoginPage", { role: result.result.provision.role });
                  }else{
                  this.dbservice.getRegistrationData().then((registration)=>{
                    if(registration && registration.step){
                      if(registration.step === 0){
                        this.nav.setRoot("RegisterStep1Page", { role: registration.role });
                      }else if(registration.step == 1){
                        this.nav.setRoot("RegisterStep2Page", registration);
                      }else if(registration.step == 2){
                        this.nav.setRoot("RegisterStep3Page", registration);
                      }
                    }else{
                      this.nav.setRoot("RegisterStep1Page", { role: result.result.provision.role });
                    }
                  })
                }
              }
                console.log("splash hide");
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
     // console.log('phoneLatLng: '+JSON.stringify(phoneLatLng));
      this.storage.set('phoneLatLng', phoneLatLng);
     // this.storage.set('currentPosition', resp);
    }).catch((error) => {
      console.log('Error getting phone location', JSON.stringify(error));
    });
  }

  pushPage(event, page) {
    if (page.iconName == 'log-out') { // logout -->
       this.dbservice.deleteUser();
      this.nav.setRoot("LoginPage"); // send to Login
      this.firebase.updateFcmToken(null, false);
    }else if(page.text == 'Wallet'){
      this.nav.push("WalletPage");
    }else{
      if(page.isTabs){
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
      }else{
        this.nav.push(page.pageName);
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
  }
}
