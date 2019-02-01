import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, MenuController, Events } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
import { FirebaseCrashlyticsProvider } from '../../providers/firebase-crashlytics';

// import { URLSearchParams } from '@angular/http';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage() @Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private LoginForm: FormGroup;
  public provisionData: any = {
    profile: { fullname: '' }
  };

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, public dataService: DataService, public loadingCtrl: LoadingController, public analytics: AnalyticsProvider, public menu: MenuController, public crashlytics: FirebaseCrashlyticsProvider, public events: Events) {
    this.storage.get('Provision').then(provision => {
      this.provisionData = provision.provision;
    })

    this.LoginForm = new FormGroup({
      // username: new FormControl(''),
      password: new FormControl('')
    });

  }

  ionViewDidLoad() {
    this.analytics.setScreenName("Login");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Login", "View"));
  }

  ionViewDidEnter() {
    this.dataService.currentPage = "LoginPage";
    this.menu.swipeEnable(false);
  }

  login(data) {
    if (data.password !== '') {

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'loginUser',
          { username: this.provisionData.user.username, password: data.password }
        ).then(async API => {
          let loading = this.loadingCtrl.create({
            content: 'Signing In....'
          });
          loading.present();
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async data => {
            loading.dismiss();
            return await this.storage.set('UserProfile', data.result).then(async UserProfile => {
              this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: UserProfile.profileData.role, fromWhere: "login" });

              //NOTE: emitting event for updating user name
              this.events.publish("login");
              if (data) {
                // TODO: do this directly though the firebase dependency, not some wrapper
                //this.firebase.updateFcmToken(null, true);
              }

              /*console.log(UserProfile);
              // TODO server-side fetchNotifications endpoint
              // to return: all notifications including jobRequests
              let API = this.smartieApi.getApi(
                'fetchNotifications',
                { profileId: UserProfile.profileData.objectId, role: UserProfile.profileData.role }
              );

              return new Promise(resolve => {
                interface Response {
                  result: any
                };
                this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
                  this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                    this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch" });
                    //this.navCtrl.push("SmartieSearch", { role: UserProfile.profileData.role, fromWhere: 'login', loggedProfileId: UserProfile.profileData.objectId, notifications: notifications });
                  })
                }, err => {
                  console.log(err);
                });
              });*/
            });
          },
            (err) => {
              loading.dismiss();
              //Pro.monitoring.exception(err);
              console.log(err);
              this.loginFailed(err);
            });
        });
      });
    } else {
      this.loginFailed(null);
    }
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Login", "Login_Btn_Clicked"));
  }

  loginFailed(err) {
    let alert;
    if (err) {
      alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: 'Username/Password invalid, or you may need to verify your email address.',
        buttons: ['OK']
      });
    } else {
      alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: 'Please use your credentials !',
        buttons: ['OK']
      });
    }
    alert.present();
  }

  pushRegister() {
    this.navCtrl.push("RegisterPage");
  }

  pushMobVerify(role) {
    this.navCtrl.push("MobileVerificationPage", { role: role });
  }

  pushForgotPassword() {
    this.navCtrl.push("ForgotPassword");
  }


  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

}
