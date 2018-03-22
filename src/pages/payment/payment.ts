import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
    });
    this.totalHours = navParams.data.totalHours;
    this.totalAmount = navParams.data.totalAmount;
    this.params = navParams.data.params
    console.log(this.params);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  paymentConfirm(){
    console.log('test');
    this.navCtrl.push("PaymentConfirmPage", { totalAmount: this.totalAmount, params: this.params });
    // this.navCtrl.push("PaymentPage");
  }

}
