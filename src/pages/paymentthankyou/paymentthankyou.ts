import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
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
  public pageContent: any;
  private fromWhere: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("Paymentthankyou");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Paymentthankyou", "View"));

    this.fromWhere = navParams.data.fromWhere;
    this.storage.get("UserProfile").then(roleProfile => {
      this.role = roleProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    this.storage.get("UserProfile").then(userProfile => {
      userProfile.profileData.scheduleDetails = {};
      this.storage.set("UserProfile", userProfile);
    });
    if(this.fromWhere == 'nonTeacherPayment'){
      this.pageContent = "<h2>Thank you</h2><p>Your Payment was successful</p><p class='mail'></p>";
    }else if(this.fromWhere == 'teacherStripePayment'){
      this.pageContent = "<h2>Success</h2><p>Your stripe account has been added to your payment details</p><p class='mail'></p>";
      this.storage.set("registeredWithStripe", true);
    }
  }

  goTo(){
    this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, payment: "success" });
  }

}
