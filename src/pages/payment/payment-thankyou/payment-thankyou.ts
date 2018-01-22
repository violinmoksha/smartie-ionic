import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentThankyouPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
})
export class PaymentThankyou {

  private emailId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.emailId = navParams.data.emailId;
  }

  goTo(){
    this.navCtrl.push("Login");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentThankyouPage');
  }

}
