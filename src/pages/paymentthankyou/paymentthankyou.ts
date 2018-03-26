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
  private pageContent: any;
  private fromWhere: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.fromWhere = navParams.data.fromWhere;
    this.storage.get("UserProfile").then(roleProfile => {
      this.userRole = roleProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    if(this.fromWhere == 'nonTeacherPayment'){
      this.pageContent = "<h2>Thank you</h2><p>Your Payment is scucess</p><p class='mail'></p>";
    }else if(this.fromWhere == 'teacherStripePayment'){
      this.pageContent = "<h2>Success</h2><p>Your stripe account added to your payment details</p><p class='mail'></p>";
    }
  }

  goTo(){
    console.log('Test');
    // this.navCtrl.push("EditProfilePage", { userRole: this.userRole });
  }

}
