import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  role: any;
  private stripeCustomer: any;
  availableBalance: any = 0;
  pendingBalance: any = 0;
  profileData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private analytics : AnalyticsProvider, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController) {
    this.analytics.setScreenName("Wallet");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Wallet", "View"));

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.stripeCustomer = profile.profileData.stripeCustomer;
      this.profileData = profile.profileData;

      let loading = this.loadingCtrl.create({
        content: 'You available balance is coming...'
      });
      loading.present();

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'getTeacherAvailableBalance',
          { stripeAccountId: this.stripeCustomer.stripe_user_id, profileId: profile.profileData.objectId }
        ).then(async API => {
          return await this.dataService.httpPost(API.apiUrl, API.apiBody, API.apiHeaders ).then(response => {
            loading.dismiss();
            console.log(response.data.result);
            this.availableBalance = response.data.result.available[0].amount / 100;
            this.pendingBalance = response.data.result.pending[0].amount / 100;
          }, err => {
            loading.dismiss();
            console.log(err.error.error.message);
          })
        });
      });
    })
  }

  initPayout(){
    console.log(this.stripeCustomer.stripe_user_id);
    console.log(this.profileData.objectId);
    console.log(this.availableBalance * 100);

    let loading = this.loadingCtrl.create({
      content: 'Transaction being process..'
    });
    loading.present();

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'createInstantPayouts',
        { stripeAccountId: this.stripeCustomer.stripe_user_id, amount: this.availableBalance * 100, profileId: this.profileData.objectId }
      ).then(async API => {
        return await this.dataService.httpPost(API.apiUrl, API.apiBody, API.apiHeaders ).then(response => {
          loading.dismiss();
            console.log(response.data.result);
        }, err => {
          loading.dismiss();
          console.log(err.error.error);
        })
      });
    });
  }
}
