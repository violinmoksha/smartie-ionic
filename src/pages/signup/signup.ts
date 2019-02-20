import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics';
//declare var google;

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  role: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider) {
    this.role = navParams.get('role');
    this.analytics.setScreenName("Signup");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Signup", "View"));
  }


}
