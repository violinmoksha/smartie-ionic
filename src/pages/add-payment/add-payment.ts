import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the AddPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage {

  private userRole: any;
  private fullName: any;
  private email: any;
  private profilePhoto: any;
  private PaymentForm : FormGroup;
  private body: any;
  private profileId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private stripe: Stripe, private smartieApi: SmartieAPI) {
    this.PaymentForm = new FormGroup({
      emailPayment: new FormControl('', Validators.required),
      emailConfirm: new FormControl('yes'),
    });
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.profileId = UserProfile.profileData.objectId;
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.email = UserProfile.userData.email;
      this.profilePhoto = UserProfile.profileData.profilePhoto.url;
    })
  }

  submitPayment(data){
    if(data.emailConfirm == 'yes'){
      data.emailPayment = this.email;
    }

    console.log(data);

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    };

    this.stripe.setPublishableKey('pk_test_HZ10V0AINd5NjEOyoEAeYSEe');
    this.stripe.createCardToken(card).then(token => {
      console.log(token);
      this.body = {
        emailPayment: data.emailPayment,
        card: card,
        profileId: this.profileId,
        token: token.id
      };

      let API = this.smartieApi.getApi(
        'createCustomer',
        this.body
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'teacherStripePayment'});
      }, err => {
        console.log(err);
      })
    })

  }

}
