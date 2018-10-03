import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { AnalyticsProvider } from '../../providers/analytics';
//import { Pro } from '@ionic/pro';

@IonicPage()@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  constructor(public navCtrl: NavController) {
    //Pro.getApp().monitoring.log('Register.construct', { level: 'error' });
    // this.analytics.setScreenName("Register");
    // this.analytics.addEvent(this.analytics.getAnalyticEvent("Register", "View"));
  }

  pushPage(item){
    if(item == 'teacher')
      this.navCtrl.push("RegisterStep1Page", { role : "teacher" });
    if(item == 'student')
      this.navCtrl.push("RegisterStep1Page", { role : "student" });
    if(item == 'parent')
      this.navCtrl.push("RegisterStep1Page", { role : "parent" });
    if(item == 'school')
      this.navCtrl.push("RegisterStep1Page", { role : "school" });
  }

}
