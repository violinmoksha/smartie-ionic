import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
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
  // private apptDate: any;
  // private apptStartTime: any;
  // private apptEndTime: any;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private dataService: DataService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private analytics: AnalyticsProvider) {
    this.analytics.setScreenName("Payment");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Payment", "View"));

    this.totalHours = navParams.get('totalHours');
    this.totalAmount = navParams.get('totalAmount');
    this.selectedDates = navParams.get('selectedDates');
    // this.apptDate = navParams.get('apptDate');
    // this.apptStartTime = navParams.get('apptStartTime');
    // this.apptEndTime = navParams.get('apptEndTime');
    this.params = navParams.get('params')

    console.log(this.params);
    // console.log(this.selectedDates);
    console.log(this.selectedDates[0].UTCstartTime);
    console.log(typeof this.selectedDates[0].UTCstartTime);

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
              this.navCtrl.push("AddPaymentPage", { fromWhere: 'nonTeacher' });
            }
          }]
        });
        alert.present();
      }
    });

    this.CardForm = new FormGroup({
      cardnumber: new FormControl('', [Validators.required]),
      monthexp: new FormControl('', [Validators.required, Validators.pattern('^[1-12]+$')]),
      yearexp: new FormControl('', [Validators.required, Validators.minLength(4)]),
      cvv: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  paymentConfirm() {
    this.navCtrl.push("PaymentConfirmPage", { totalAmount: this.totalAmount, params: this.params });
    // this.navCtrl.push("PaymentPage");
  }

  pay(amount, cardValue) {
    console.log(amount);
    console.log(this.stripeCustomer);
    console.log(this.stripeCustomerCard);

    if (this.stripeCustomerCard == undefined) {
      console.log(cardValue);

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'createCardToken',
          { cardValue: cardValue, customerId: this.stripeCustomer, otherProfileId: this.otherProfileId }
        ).then(async API => {
          return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
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
      customerId: this.stripeCustomer,
      teacherAccountId: this.params.profileStripeAccount.stripe_user_id,
      teacherProfileId: this.params.teacherProfileId,
      fullName: this.params.fullName,
      otherProfileId: this.otherProfileId,
      jobRequestId: this.params.jobRequestId,
      selectedDates: this.selectedDates,
      // apptDate: this.apptDate,
      // startTime: this.apptStartTime,
      // endTime: this.apptEndTime
    };
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'createTransaction',
        this.body
      ).then(async API => {
        return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(async response => {
          this.loading.dismiss();
          this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment' });
          return response;
        }, err => {
          console.log(err);
          return err;
        })
      });
    })
  }

}
