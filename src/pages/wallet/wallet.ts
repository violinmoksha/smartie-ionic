import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private analytics : AnalyticsProvider, private storage: Storage, private smartieApi: SmartieAPI, private loadingCtrl: LoadingController) {
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
        let API = await this.smartieApi.getApi(
          'getTeacherAvailableBalance',
          { stripeAccountId: this.stripeCustomer.stripe_user_id, profileId: profile.profileData.objectId }
        );
        interface Response {
          result: any;
        };
        this.smartieApi.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).then(response => {
          loading.dismiss();
          console.log(response[0].result);
          this.availableBalance = response[0].result.available[0].amount / 100;
          this.pendingBalance = response[0].result.pending[0].amount / 100;
        }, err => {
          loading.dismiss();
          console.log(err.error.error.message);
        })
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
      let API = await this.smartieApi.getApi(
        'createInstantPayouts',
        { stripeAccountId: this.stripeCustomer.stripe_user_id, amount: this.availableBalance * 100, profileId: this.profileData.objectId }
      );
      this.smartieApi.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).then(response => {
        loading.dismiss();
          console.log(response[0].result);
      }, err => {
        loading.dismiss();
        console.log(err.error.error);
      })
    });
  }
}
