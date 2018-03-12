import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PaymentthankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymentthankyou',
  templateUrl: 'paymentthankyou.html',
})
export class PaymentthankyouPage {

  private userRole: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.storage.get("UserProfile").then(roleProfile => {
      this.userRole = roleProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentthankyouPage');
  }

  goTo(){
    console.log('Test');
    // this.navCtrl.push("EditProfilePage", { userRole: this.userRole });
  }

}
