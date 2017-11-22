import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';
import { Stripe } from '@ionic-native/stripe';

/**
 * Generated class for the CardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {

  private CardForm: FormGroup;
  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, private smartieApi: SmartieAPI) {

    this.CardForm = this.formBuilder.group({
      cardname: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cardcvv: ['', Validators.required]
    });
  }

  pay(cardData){
    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');

    let customerToken = JSON.parse(localStorage.getItem(this.navParams.data.customerId + 'customerToken'));
    console.log(customerToken);
    let API = this.smartieApi.getApi(
      'createTransaction',
      { customerToken: customerToken, customerId: this.navParams.data.customerId }
    );

    return new Promise(resolve => {
      interface Response {};
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(res => {
        console.log(res);
      });
    });
  }

}
