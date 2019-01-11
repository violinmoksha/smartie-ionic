import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { AnalyticsProvider } from '../../providers/analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the AddPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage {

  private userRole: any;
  private fullName: any;
  private email: any;
  private profilePhoto: any;
  private PaymentForm: FormGroup;
  private body: any;
  private profileId: any;
  private userIP: string;
  private fromWhere: any;
  private authenticationCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, private themeableBrowser: ThemeableBrowser, private analytics: AnalyticsProvider, public platform: Platform, public iaBrowser: InAppBrowser) {
    this.analytics.setScreenName("AddPayment");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("AddPayment", "View"));

    this.fromWhere = navParams.data.fromWhere;
    this.PaymentForm = new FormGroup({
      emailPayment: new FormControl('', Validators.required),
      emailConfirm: new FormControl('yes'),
    });
    this.dataService.http.get('https://icanhazip.com', { responseType: 'text' }, {}).then(res => {
      this.userIP = res.data.replace(/\s/g, "");
      console.log(`IP ADDRESS: ${this.userIP}`);
    })
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.profileId = UserProfile.profileData.objectId;
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.email = UserProfile.userData.email;
      if (UserProfile.profileData.profilePhoto) {
        this.profilePhoto = UserProfile.profileData.profilePhoto;
      } else {
        this.profilePhoto = './assets/imgs/user-img-teacher.png';
      }

      // this.stripeAccountId = UserProfile.profileData.stripeCustomer.id;
    })
  }

  /* updateStripeAccount() {
    //console.log(this.stripeAccountId);
    this.body = {
      // stripeAccountId: this.stripeAccountId,
      // profileId: this.profileId,
      // userIP: this.userIP // for TOS acceptance
    };
    let API = this.smartieApi.getApi(
      'deleteTeacherAccount',
      this.body
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
      this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'teacherStripePayment' });
    }, err => {
      console.log(err);
    })
  } */

  addStripeAccount(data) {

    if (data.emailConfirm == 'yes') {
      data.emailPayment = this.email;
    }

    data.firstName = this.fullName;
    data.businessType = 'individual';

    // ca_CZWQogI2PEylvxAJTYTaxEwrLQQVMA5x  --> CLIENT_ID
    console.log("adding payment")
    console.log(data);

    if (this.userRole == 'teacher') {

      let url = "https://connect.stripe.com/express/oauth/authorize?client_id=ca_CZWQIYkWpLrTkC9gAvq3gHcmBlUfLXBH&state=state&stripe_user[email]=" + data.emailPayment;
      if (this.platform.is("ios")) {
        console.log("laoding ios web browser");
        let webBrowser = this.iaBrowser.create(url);
        webBrowser.show();
        webBrowser.on("loadstop").subscribe(e => {
          console.log(e);
          this.authenticationCode = this.dataService.getParameterByName('code', e.url);
          console.log(this.authenticationCode)
          if (this.authenticationCode) {
            webBrowser.close();

            this.body = { emailPayment: data.emailPayment, profileId: this.profileId, code: this.authenticationCode }
            this.createStripeAccount('createStripeTeacherAccount', this.body);
          }
        });
        webBrowser.on("loadstart").subscribe(e => {
          console.log("load start");
          console.log(e);
        })
      } else {
        const options: ThemeableBrowserOptions = {
          toolbar: {
            height: 44,
            color: '#00BA63'
          },
          title: {
            color: '#ffffff',
            showPageTitle: true,
            staticText: "Add Stripe Payment"
          },
          // closeButton: {
          //   wwwImage: './assets/imgs/close.svg',
          //   wwwImagePressed: './assets/imgs/close.svg',
          //   align: 'left',
          //   event: 'closePressed'
          // },
          backButtonCanClose: true
        }
        console.log("themable browser android")
        const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_self', options);

        browser.on('loadstop').subscribe(event => {
          console.log(event.url);
          this.authenticationCode = this.dataService.getParameterByName('code', event.url);
          console.log(this.authenticationCode)
          if (this.authenticationCode) {
            browser.close();

            this.body = { emailPayment: data.emailPayment, profileId: this.profileId, code: this.authenticationCode }
            this.createStripeAccount('createStripeTeacherAccount', this.body);
          }
        });
      }
    } else {
      this.body = { emailPayment: data.emailPayment, userIP: this.userIP, profileId: this.profileId };
      this.createStripeAccount('createCustomer', this.body);
    }
  }

  createStripeAccount(endPoint, body) {
    let loading = this.loadingCtrl.create({
      content: 'Creating Stripe Account...'
    });
    loading.present();

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        endPoint,
        body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          console.log(response.result);
          this.dataService.updateUserProfileStorage(response.result).then(profile => {
            loading.dismiss();
            //this.navCtrl.push('NotificationFeedPage', { stripeAccount: response.result });
          })
        }, err => {
          loading.dismiss();
          console.log(err);
        });
      });
    })
  }
}
