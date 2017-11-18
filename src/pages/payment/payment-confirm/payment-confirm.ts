import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { PaymentThankyou } from './../payment-thankyou/payment-thankyou';
import { Constants } from '../../../app/app.constants';
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
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public http: HttpClient, private stripe: Stripe) {
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

    // TODO: following block of code should be a straightforward refactor,
    // as it is occurring in more than one .ts now
    if(Constants.API_ENDPOINTS.env === 'local'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.local;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'test'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.test;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.prod;
      this.applicationId = Constants.API_ENDPOINTS.headers.prod.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.prod.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.prod.contentType;
    }

    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    };

    // now it's secure, with aligned design mod+discussion ;-)
    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.createCustomer;
    let headers = new HttpHeaders();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);
    let body = { emailPayment: data.emailPayment, card: card, profileId: this.navParams.data.profileId  };

    return this.http.post(postUrl, body, { headers: headers }).toPromise().then((res) =>{
      console.log(data.emailPayment);
/*    if(res.status == 200){
        this.navCtrl.push(PaymentThankyou, { emailId: data.emailPayment });
      }
*/
    });

    // happens backend since this has "the token" inside it
    /*
    this.stripe.createCardToken(card).then((token) => {

    })*/


  }

}
