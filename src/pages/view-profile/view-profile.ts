import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  role: any;
  params: any;
  genericAvatar: any;
  timeZone: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,public storage: Storage) {
    this.analytics.setScreenName("ViewProfile");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("ViewProfile", "View"));

    this.params = navParams.get("params");
    console.log(this.params);

    this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

    if (this.params.role == 'teacher') {
      this.genericAvatar = '/assets/imgs/user-img-teacher.png';
    } else if (this.params.role == 'student') {
      this.genericAvatar = '/assets/imgs/user-img-student.png';
    } else if (this.params.role == 'parent') {
      this.genericAvatar = '/assets/imgs/user-img-parent.png';
    } else if (this.params.role == 'school') {
      this.genericAvatar = '/assets/imgs/user-img-school.png';
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    })
  }

  viewReviews(){
    this.navCtrl.push("ReviewsPage", { params: this.params });
  }

}
