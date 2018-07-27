import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

/**
 * Generated class for the SetReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  profileData: any;
  role: any;
  feedback: any = '';
  genericAvatar: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI,private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("Feedback");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Feedback", "View"));
    this.profileData = navParams.get("profileData");

    if (this.profileData.role == 'teacher') {
      this.genericAvatar = '/assets/imgs/user-img-teacher.png';
    } else if (this.profileData.role == 'student') {
      this.genericAvatar = '/assets/imgs/user-img-student.png';
    } else if (this.profileData.role == 'parent') {
      this.genericAvatar = '/assets/imgs/user-img-parent.png';
    } else if (this.profileData.role == 'school') {
      this.genericAvatar = '/assets/imgs/user-img-school.png';
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
  }

  submitFeedback(){
    // let API = this.smartieApi.getApi(
    //   'setFeedback',
    //   { feedback: this.feedback, profileId: this.profileData.objectId }
    // );
    // interface Response {
    //   result: any
    // }
    // this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
    //   console.log(response.result);
    // })

  }

}
