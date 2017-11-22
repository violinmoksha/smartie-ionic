import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartieAPI } from '../../../providers/api/smartie';
import 'rxjs/add/operator/toPromise';
import { PaymentThankyou } from './../payment-thankyou/payment-thankyou';
import { Stripe } from '@ionic-native/stripe';

/**
 * Generated class for the PaymentConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment-confirm',
  templateUrl: 'payment-confirm.html',
})
export class PaymentConfirm {

  private PaymentForm: FormGroup;
  public currentEmail: string;
  public token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private smartieApi: SmartieAPI, private stripe: Stripe) {
    this.currentEmail = navParams.data.email;
    this.PaymentForm = formBuilder.group({
      emailPayment: ['', Validators.required],
      emailConfirm: ''
    });



    // this.stripe.createCardToken(card)
    //   .then((token) => {
    //     this.token = token;
    //   })  // ---> submitPayment
    //   .catch(error => console.error(error));
  }

  submitPayment(data){
    if(data.emailConfirm == 'yes'){
      data.emailPayment = this.currentEmail;
    }

    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    };

    let API = this.smartieApi.getApi(
      'createCustomer',
      { emailPayment: data.emailPayment, card: card, profileId: this.navParams.data.profileId  }
    );
    return new Promise(resolve => {
      interface Response {
        status: number
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(res => {
        console.log(data.emailPayment);
        if(res.status == 200){
          this.navCtrl.push(PaymentThankyou, { emailId: data.emailPayment });
        }
      });
    });

    // happens backend since this has "the token" inside it
    /*
    this.stripe.createCardToken(card).then((token) => {

    })*/
  }

}
