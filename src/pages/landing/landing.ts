import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics';

/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public analytics:AnalyticsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    this.analytics.setScreenName("Landing");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Landing", "View"));

  }

  pushMobVerify(role){
    this.navCtrl.push("MobileVerificationPage", { role: role });
    // TODO: redo this using plain ol storage
    //this.dbService.setRegistrationData({ step:0, role:role})
    // this.analytics.addEvent(this.analytics.getAnalyticEvent("Landing", role+"_selected"));
  }

  pushForgotPassword(){
    this.navCtrl.push("ForgotPassword");
  }
}
