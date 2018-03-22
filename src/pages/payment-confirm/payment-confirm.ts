import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

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

  tooltipEvent: 'click' | 'press' = 'click';
  showArrow: boolean = true;
  duration: number = 3000;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
    });
    this.totalAmount = this.navParams.data.totalAmount;

    this.CardForm = new FormGroup({
      cardnumber: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      monthexp: new FormControl('', [Validators.required, Validators.pattern('^[1-12]+$')]),
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
