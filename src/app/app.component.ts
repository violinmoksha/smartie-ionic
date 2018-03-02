import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class SmartieApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  buttons: Array<{iconName: string, text: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, public events: Events, private push: Push, private alertCtrl: AlertController) {
    this.initializeApp();

    this.storage.get('sessionToken').then(val => {
      if (val !== 'undefined') {
        this.rootPage = "LoginPage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
    //this.rootPage = EditUserComponent;

    this.events.subscribe("buttonsLoad", eventData => {
      if (eventData !== 'teacher') {
        this.buttons = [
          { iconName: 'card', text: 'Payment Details' },
          { iconName: 'book', text: 'Manage Orders' },
          { iconName: 'qr-scanner', text: 'Scan QR Promo' },
          { iconName: 'settings', text: 'Profile Settings' },
          { iconName: 'paper', text: 'Give Feedback' },
          { iconName: 'add-circle', text: 'Create a Job' },
          { iconName: 'log-out', text: 'Logout' }
        ];
      } else {
        this.buttons = [
          { iconName: 'card', text: 'Payment Details' },
          { iconName: 'book', text: 'Manage Orders' },
          { iconName: 'qr-scanner', text: 'Scan QR Promo' },
          { iconName: 'settings', text: 'Profile Settings' },
          { iconName: 'paper', text: 'Give Feedback' },
          { iconName: 'log-out', text: 'Logout' }
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
        this.splashScreen.hide();
        this.initPushNotifications();
      }
    });
  }

  initPushNotifications() {
    const options: PushOptions = {
      android: {
        senderID: '187672812179'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push("JobRequestPage", { message: data.message });
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push("JobRequestPage", { message: data.message });
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  pushPage(event, button) {
    if (button.iconName == 'paper')
      this.nav.push("FeedbackPage");
    else if (button.iconName == 'settings')
      this.nav.push("EditProfilePage");
    else if (button.iconName == 'add-circle')
      this.nav.push("CreateJobPage");
    else if (button.iconName == 'log-out') { // logout -->
      localStorage.clear(); // dump ephemeral session
      this.nav.setRoot("LoginPage"); // send to Login
    }
  }
}
