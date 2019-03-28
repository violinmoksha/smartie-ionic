import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
import { JobRequestProvider } from '../../providers/job-request';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  private userRole: string;
  public genericAvatar: string = '/assets/imgs/user-img-teacher.png';
  private totalHours: number;
  private totalAmount: number;
  private params: any;
  private CardForm: FormGroup;
  private stripeCustomerCard: any = { "last4": '', "exp_month": '', "exp_year": '' };
  private stripeCustomer: any;
  private body: any;
  private otherProfileId: any;
  private selectedDates: any;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private dataService: DataService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private analytics: AnalyticsProvider, private jobRequestProvider: JobRequestProvider) {
    this.analytics.setScreenName("Payment");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Payment", "View"));

    this.totalHours = navParams.get('totalHours');
    this.totalAmount = navParams.get('totalAmount');
    this.selectedDates = navParams.get('selectedDates');
    this.params = navParams.get('params');

    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      this.otherProfileId = UserProfile.profileData.objectId;

      //Check for user register with stripe as a customer for non-teacher profile
      if (UserProfile.profileData.stripeCustomer != undefined) {
        this.stripeCustomer = UserProfile.profileData.stripeCustomer.id;
        this.stripeCustomerCard = UserProfile.profileData.stripeCustomer.sources.data[0];
        if (this.stripeCustomerCard != undefined) {
          this.stripeCustomerCard.last4 = '**** **** **** ' + this.stripeCustomerCard.last4;
        }
      } else {
        let alert = this.alertCtrl.create({
          title: 'Please register with Stripe...',
          subTitle: 'You must register with stripe account to make a payment ;-)',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.push("AddPaymentPage", { fromWhere: 'nonTeacher', params: this.params });
            }
          }]
        });
        alert.present();
      }
    });

    this.CardForm = new FormGroup({
      cardnumber: new FormControl('', [Validators.required]),
      monthexp: new FormControl('', [Validators.required, this.monthValidator(1, 12)]),
      yearexp: new FormControl('', [Validators.required, Validators.minLength(4), this.yearValidator()]),
      cvv: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }


 yearValidator(): ValidatorFn {
   return (control: AbstractControl): { [key: string]: boolean } | null => {
       if (control.value !== undefined && (isNaN(control.value) || control.value < new Date().getFullYear())) {
           return { 'yearValidation': true };
       }
       return null;
   };
 }

  monthValidator(min: 1, max: 12): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'monthRange': true };
        }
        return null;
    };

}

  paymentConfirm() {
    this.navCtrl.push("PaymentConfirmPage", { totalAmount: this.totalAmount, params: this.params });
  }

  pay(amount, cardValue) {

    if (this.stripeCustomerCard == undefined) {

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'createCardToken',
          { cardValue: cardValue, customerId: this.stripeCustomer, otherProfileId: this.otherProfileId }
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
            this.createTransaction(amount);
            return response;
          }, err => {
            console.log(err);
            return err;
          })
        });
      })
    } else {
      this.createTransaction(amount);
    }
  }

  createTransaction(amount) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();

    this.body = {
      amountPayable: amount * 100, // in cents
      studentStripeId: this.stripeCustomer,
      teacherStripeId: this.params.profileStripeAccount.stripe_user_id,
      teacherProfileId: this.params.teacherProfileId,
      fullName: this.params.fullName,
      otherProfileId: this.otherProfileId,
      jobRequestId: this.params.jobRequestId,
      selectedDates: this.selectedDates,
      jobRequestState: this.jobRequestProvider.jobRequestState.scheduled
    };
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'createTransaction',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          this.loading.dismiss();
          this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment' });
          return response;
        }, err => {
          this.loading.dismiss();
          console.log(err);
          return err;
        })
      });
    })
  }

}
