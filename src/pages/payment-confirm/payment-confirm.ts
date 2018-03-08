import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.totalAmount = this.navParams.data.totalAmount;

    this.CardForm = new FormGroup({
      cardnumber: new FormControl('', Validators.required),
      monthexp: new FormControl('', Validators.required),
      yearexp: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentConfirmPage');
  }

  pay(){
    this.navCtrl.push("PaymentthankyouPage");
  }

}
