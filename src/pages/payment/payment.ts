import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';
import { SmartieAPI } from '../../providers/api/smartie';

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
  private genericAvatar: string = '/assets/imgs/user-img-teacher.png';
  private card: string = '/assets/imgs/visa-card.png';
  private totalHours: number;
  private totalAmount: number;
  private params: any;
  private CardForm: FormGroup;
  private stripeCustomerCard: any = { "last4": '', "exp_month": '', "exp_year": ''};
  private stripeCustomer: any;
  private body: any;
  private otherProfileId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private stripe: Stripe) {

    this.totalHours = navParams.data.totalHours;
    this.totalAmount = navParams.data.totalAmount;
    this.params = navParams.data.params

    console.log(this.params);

    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      this.otherProfileId = UserProfile.profileData.objectId;

      //Check for user register with stripe as a customer for non-teacher profile
      if(UserProfile.profileData.stripeCustomer != undefined){
        this.stripeCustomer = UserProfile.profileData.stripeCustomer.id;
        this.stripeCustomerCard = UserProfile.profileData.stripeCustomer.sources.data[0];
        if(this.stripeCustomerCard != undefined){
          this.stripeCustomerCard.last4 = '**** **** **** ' + this.stripeCustomerCard.last4;
        }
      }else{
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

  paymentConfirm(){
    this.navCtrl.push("PaymentConfirmPage", { totalAmount: this.totalAmount, params: this.params });
    // this.navCtrl.push("PaymentPage");
  }

  pay(amount, cardValue){
    console.log(amount);
    console.log(this.stripeCustomer);
    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');
    this.stripe.createCardToken({
      number: cardValue.cardnumber,
      expMonth: cardValue.monthexp,
      expYear: cardValue.yearexp,
      cvc: cardValue.cvv,
    }).then(cardToken => {
      this.body = {
        amountPayable: amount * 100, // in cents
        customerId: this.stripeCustomer,
        teacherAccountId: this.params.profileStripeAccount.id,
        otherProfileId: this.otherProfileId,
        cardToken: cardToken.id,
        jobRequestId: this.params.jobRequestId
      };
      let API = this.smartieApi.getApi(
        'createTransaction',
        this.body
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment'});
      }, err => {
        console.log(err);
      })
    })

    /*this.body = {
      amountPayable: amount * 100, // in cents
      customerId: this.stripeCustomer,
      teacherAccountId: this.params.profileStripeAccount.id,
      otherProfileId: this.otherProfileId
    };
    let API = this.smartieApi.getApi(
      'createTransaction',
      this.body
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
      this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment'});
    }, err => {
      console.log(err);
    })*/
    // this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment'});
  }

}
