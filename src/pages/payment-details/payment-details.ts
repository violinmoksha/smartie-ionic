import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
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

  public userRole: string;
  public fullName: any;
  public registeredWithStripe: boolean = false;
  private stripeCustomerId: any;
  private notification: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, private analytics: AnalyticsProvider, public themeableBrowser: ThemeableBrowser, public events: Events, private viewCtrl: ViewController) {
    this.analytics.setScreenName("PaymentDetails");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("PaymentDetails", "View"));

    this.notification = this.navParams.get("notification") ? this.navParams.get("notification") : "";
    console.log("Test");
    console.log(this.notification);

  }

  ionViewDidEnter() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      if (UserProfile.profileData.stripeCustomer !== undefined && UserProfile.profileData.stripeCustomer.stripe_user_id) {
        this.registeredWithStripe = true;
        this.stripeCustomerId = UserProfile.profileData.stripeCustomer.stripe_user_id;
      }
    });
  }



  addPayment() {
    if(this.notification != ""){
      this.viewCtrl.dismiss();
    }
    this.navCtrl.push('AddPaymentPage', { fromWhere: 'teacher', notification: this.notification });
  }

  viewStripeDashboard() {
    let loading = this.loadingCtrl.create({
      content: 'Fetching Stripe Account...'
    });
    loading.present();

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'createStripeLoginLink',
        { stripeAccountId: this.stripeCustomerId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          loading.dismiss();
          if (response.result.url) { // ??? NB: everything is usually response.data.result now FYI using @ionic-native/http
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
              closeButton: {
                wwwImage: 'assets/imgs/close-white.png',
                wwwImagePressed: 'assets/imgs/close-white.png',
                align: 'left',
                event: 'closePressed'
              },
              backButtonCanClose: true
            }
            this.themeableBrowser.create(response.result.url, '_blank', options);

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
