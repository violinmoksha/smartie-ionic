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

  getURLHost(url){
    return new Promise((resolve) => {
      var parser = document.createElement('a'),
          searchObject = {},
          queries, split, i;
      // Let the browser do the work
      parser.href = url;
      // Convert query string to object
      queries = parser.search.replace(/^\?/, '').split('&');
      for( i = 0; i < queries.length; i++ ) {
          split = queries[i].split('=');
          searchObject[split[0]] = split[1];
      }
      resolve(
        {
          protocol: parser.protocol,
          host: parser.host,
          hostname: parser.hostname,
          port: parser.port,
          pathname: parser.pathname,
          search: parser.search,
          searchObject: searchObject,
          hash: parser.hash
       });
    });
  }

  addStripeAccount(data) {

    if (data.emailConfirm == 'yes') {
      data.emailPayment = this.email;
    }

    data.firstName = this.fullName;
    data.businessType = 'individual';

    // ca_CZWQogI2PEylvxAJTYTaxEwrLQQVMA5x  --> CLIENT_ID
    if (this.userRole == 'teacher') {

      let url = "https://connect.stripe.com/express/oauth/authorize?client_id=ca_CZWQIYkWpLrTkC9gAvq3gHcmBlUfLXBH&state=state&stripe_user[email]=" + data.emailPayment;

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
        backButtonCanClose: true
      }

      const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);
      // browser.show();
      browser.on('loadstart').subscribe(e => {
        this.getURLHost(e.url).then((hostName: any) => {
          if (hostName.host == 'localhost:9634') {
            this.authenticationCode = hostName.searchObject.code;
            browser.close();

            this.body = { emailPayment: data.emailPayment, profileId: this.profileId, code: this.authenticationCode }
            this.createStripeAccount('createStripeTeacherAccount', this.body);
          }
        });
      });
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
            this.navCtrl.push('NotificationFeedPage', { stripeAccount: response.result });
          })
        }, err => {
          loading.dismiss();
          console.log(err);
        });
      });
    })
  }
}
