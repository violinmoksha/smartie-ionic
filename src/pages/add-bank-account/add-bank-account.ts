import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the AddBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-bank-account',
  templateUrl: 'add-bank-account.html',
})
export class AddBankAccountPage {

  private BankAccountForm: FormGroup;
  private params: any;
  private userRole: any;
  private profileId: any;
  private fullName: any;
  private body: any;
  private profilePhoto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,public storage: Storage, private stripe: Stripe, private dataService: DataService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.analytics.setScreenName("AddBankAccount");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("AddBankAccount", "View"));

    this.params = navParams.data;

    this.BankAccountForm = new FormGroup({
      accountNumber: new FormControl('', Validators.required),
      routingNumber: new FormControl('', Validators.required),
      accountHolderName: new FormControl('', Validators.required),
      accountHolderType: new FormControl('', Validators.required)
    })
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.profileId = UserProfile.profileData.objectId;
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.profilePhoto = this.profilePhoto = UserProfile.profileData.profilePhoto.url;
    })
  }

  submit(bankAccoutnValues){
    let loading = this.loadingCtrl.create({
      content: 'Adding Bank Account...'
    });
    loading.present();

    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');
    this.stripe.createBankAccountToken({
      country: 'US',
      currency: 'usd',
      routing_number: bankAccoutnValues.routingNumber,
      account_number: bankAccoutnValues.accountNumber,
      account_holder_name: bankAccoutnValues.accountHolderName,
      account_holder_type: bankAccoutnValues.accountHolderType,
    }).then(bankToken => {
      this.body = {
        stripeAccountId: this.params.stripeAccount.stripeCustomer.id,
        profileId: this.profileId,
        bankToken: bankToken
      };

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'addBankAccount',
          this.body
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders'] ).then(async response => {
            // TODO: just use storage for this!! no more useless wrappers like this
            //return await this.dataService.updateUserProfileStorage(response.data.result).then(profile => {
              //loading.dismiss();
              this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'teacherStripePayment'});
            //});
          }, err => {
            console.log(err.error.message);
            this.addBankAccountError(err.error.message);
          })
        });
      })
    }, err => {
      console.log(err);
      loading.dismiss();
      this.addBankAccountError(err);
    })

  }

  addBankAccountError(errorMessage){
    let alert;

    alert = this.alertCtrl.create({
      title: 'Identify Verification Failed !',
      subTitle: errorMessage,
      buttons: ['OK']
    });

    alert.present();
  }

}
