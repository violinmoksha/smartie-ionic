import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

/**
 * Generated class for the PaymentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {

  private userRole: string;
  private fullName: any;
  private registeredWithStripe: boolean = false;
  private stripeCustomerId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private smartieApi: SmartieAPI, private loadingCtrl: LoadingController, private themeableBrowser: ThemeableBrowser) {

  }

  ionViewDidLoad() {
    //this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment'});
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;      
      if(UserProfile.profileData.stripeCustomer !== undefined){
        this.registeredWithStripe = true;
        this.stripeCustomerId = UserProfile.profileData.stripeCustomer.stripe_user_id;
      }
    });
  }

  addPayment(){
    this.navCtrl.push('AddPaymentPage', { fromWhere: 'teacher' });
  }

  viewStripeDashboard(){
    let loading = this.loadingCtrl.create({
      content: 'Creating Stripe Account...'
    });
    loading.present();

    let API = this.smartieApi.getApi(
      'createStripeLoginLink',
      { stripeAccountId: this.stripeCustomerId }
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
      if(response.result.url){
        loading.dismiss();
        const options: ThemeableBrowserOptions = {
          toolbar: {
            height: 44,
            color: '#00BA63'
          },
          title: {
            color: '#ffffff',
            showPageTitle: true,
            staticText: "Payment Details"
          },
          backButtonCanClose: true
        }
        // const browser = this.iab.create(response.result.url, '_self', { location:'no', toolbar: 'no', hardwareback: 'no'});
        const browser: ThemeableBrowserObject = this.themeableBrowser.create(response.result.url, '_self', options);

        /* browser.on('loadstop').subscribe(event => {
          console.log(event);
        }); */
      }
    }, err => {
      console.log(err);
    });
  }

}
