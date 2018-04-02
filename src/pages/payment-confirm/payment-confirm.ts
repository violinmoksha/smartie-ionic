import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the PaymentConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-confirm',
  templateUrl: 'payment-confirm.html',
})
export class PaymentConfirmPage {

  private totalAmount: number;
  private CardForm: FormGroup;
  private userRole: any;
  private stripeCustomer: any;
  private body: any;
  private params: any;

  tooltipEvent: 'click' | 'press' = 'click';
  showArrow: boolean = true;
  duration: number = 3000;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private smartieApi: SmartieAPI) {
    this.params = navParams.data.params
    console.log("Payment Confirm Page");
    console.log(this.params);
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      if(UserProfile.profileData.stripeCustomer){
        this.stripeCustomer = UserProfile.profileData.stripeCustomer.id;
      }
    });
    this.totalAmount = this.navParams.data.totalAmount;

    this.CardForm = new FormGroup({
      cardnumber: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      monthexp: new FormControl('', [Validators.required, Validators.pattern('^[1-12]+$')]),
      yearexp: new FormControl('', [Validators.required, Validators.minLength(4)]),
      cvv: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  ionViewDidLoad() {
  }

  pay(amount){
    console.log(amount);
    console.log(this.stripeCustomer);
    this.body = {
      amountPayable: amount * 100, // in cents
      customerId: this.stripeCustomer,
      teacherAccountId: this.params.profileStripeAccount.id
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
    // this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'nonTeacherPayment'});
  }

}
