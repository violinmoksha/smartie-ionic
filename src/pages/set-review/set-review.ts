import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { SmartieAPI } from '../../providers/api/smartie';
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
  selector: 'page-set-review',
  templateUrl: 'set-review.html',
})
export class SetReviewPage {

  profileData: any;
  role: any;
  rating: any = '';
  review: any = '';
  private reviewedProfileId: any;
  private reviewingProfileId: any;
  genericAvatar: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,public storage: Storage) {
    this.analytics.setScreenName("SetReview");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("SetReview", "View"));

    this.profileData = navParams.get("profileData");
    this.reviewedProfileId = this.profileData.objectId;

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
      this.reviewingProfileId = profile.profileData.objectId;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
  }

  ratingChanged(event){
    console.log(event);
    this.rating = event;
  }

  submitReview(){
    console.log(this.rating);
    console.log(this.review);

    /*let API = this.smartieApi.getApi(
      'setReview',
      { reviewedProfileId: this.reviewedProfileId, reviewingProfileId: this.reviewingProfileId, reviewStars: this.rating, reviewFeedback: this.review }
    );
    interface Response {
      result: any
    }
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
      console.log(response.result);
    })*/

  }

}
