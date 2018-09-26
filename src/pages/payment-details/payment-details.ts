import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
//import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
import { AnalyticsProvider } from '../../providers/analytics';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController,private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("PaymentDetails");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("PaymentDetails", "View"));
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

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'createStripeLoginLink',
        { stripeAccountId: this.stripeCustomerId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          if(response.result.url){ // ??? NB: everything is usually response.data.result now FYI using @ionic-native/http
            loading.dismiss();
            // const options: ThemeableBrowserOptions = {
            //   toolbar: {
            //     height: 44,
            //     color: '#00BA63'
            //   },
            //   title: {
            //     color: '#ffffff',
            //     showPageTitle: true,
            //     staticText: "Payment Details"
            //   },
            //   backButtonCanClose: true
            // }
            // const browser = this.iab.create(response.result.url, '_self', { location:'no', toolbar: 'no', hardwareback: 'no'});
            //const browser: ThemeableBrowserObject = this.themeableBrowser.create(response[0].result.url, '_self', options);

            /* browser.on('loadstop').subscribe(event => {
              console.log(event);
            }); */
          }
          // may need to return here for Tests???
        }, err => {
          console.log(err);
          return err;
        });
      });
    })

  }

}
