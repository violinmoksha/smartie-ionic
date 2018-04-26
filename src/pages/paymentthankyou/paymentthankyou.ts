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

  private role: any;
  private pageContent: any;
  private fromWhere: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.fromWhere = navParams.data.fromWhere;
    this.storage.get("UserProfile").then(roleProfile => {
      this.role = roleProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    if(this.fromWhere == 'nonTeacherPayment'){
      this.pageContent = "<h2>Thank you</h2><p>Your Payment was successful</p><p class='mail'></p>";
    }else if(this.fromWhere == 'teacherStripePayment'){
      this.pageContent = "<h2>Success</h2><p>Your stripe account has been added to your payment details</p><p class='mail'></p>";
      this.storage.set("registeredWithStripe", true);
    }
  }

  goTo(){
    //console.log('Test');
    this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, payment: "success" });
  }

}
