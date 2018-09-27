import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("Landing");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Landing", "View"));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }

  // pushRegister(){
  //   this.navCtrl.push("RegisterPage");
  // }

  pushMobVerify(role){
    this.navCtrl.push("MobileVerificationPage", { role: role });
    // TODO: redo this using plain ol storage
    //this.dbService.setRegistrationData({ step:0, role:role})
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Landing", role+"_selected"));
  }

  pushForgotPassword(){
    this.navCtrl.push("ForgotPassword");
  }
}
