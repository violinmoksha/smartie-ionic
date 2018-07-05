import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MobileVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-verification',
  templateUrl: 'mobile-verification.html',
})
export class MobileVerificationPage {

  role: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = navParams.get('role');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');
  }

  pushSignUp(){
    this.navCtrl.push("SignupPage", { role: this.role });
  }

}
