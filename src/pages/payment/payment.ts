import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PaymentConfirm } from './payment-confirm/payment-confirm';

/**
 * Generated class for the PaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class Payment {

  private teacherProfile: any;
  private fullname: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.teacherProfile = JSON.parse(localStorage.getItem('teacheruserProfile'));
    console.log(this.teacherProfile);
    this.fullname = this.teacherProfile.profileData.fullname;
  }

  goTo(paymentConfirm){
    this.navCtrl.push(PaymentConfirm, { fullname: this.fullname, role: this.teacherProfile.profileData.role, phone: this.teacherProfile.profileData.phone, email: this.teacherProfile.userData.email, profileId: this.teacherProfile.profileData.objectId });
  }
}
