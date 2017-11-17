import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/app.constants';
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
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;
  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, private http: HttpClient) {

    this.CardForm = this.formBuilder.group({
      cardname: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cardcvv: ['', Validators.required]
    });
  }

  pay(cardData){
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

    let customerToken = JSON.parse(localStorage.getItem(this.navParams.data.customerId + 'customerToken'));
    console.log(customerToken);
    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.createTransaction;
    let headers = new HttpHeaders();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);

    let data = { customerToken: customerToken, customerId: this.navParams.data.customerId };

    this.http.post(postUrl, data, { headers: headers }).toPromise().then((res) => {
      console.log(res);
    })



    // let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.createTransaction;
    // let headers = new Headers();
    // headers.append('X-Parse-Application-Id', this.applicationId);
    // headers.append('X-Parse-Master-Key', this.masterKey);
    // headers.append('Content-Type', this.contentType);
    //
    // return this.http.post(postUrl, { headers: headers }).toPromise().then((res) => {
    //   console.log(res);
    // })
  }

}
