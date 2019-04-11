import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/app.data';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';

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
  jobRequestId: any;
  role: any;
  rating: any = '';
  review: any = '';
  private reviewedProfileId: any;
  private reviewingProfileId: any;
  genericAvatar: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,public storage: Storage, private dataService: DataService) {
    this.analytics.setScreenName("SetReview");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("SetReview", "View"));

    this.profileData = navParams.get("profileData");
    this.jobRequestId = navParams.get("jobRequestId");

    console.log(this.jobRequestId);

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

  ratingChanged(event){
    this.rating = event;
  }

  submitReview(){
    this.dataService.getApi(
      'setReview',
      { reviewedProfileId: this.reviewedProfileId, reviewingProfileId: this.reviewingProfileId, reviewStars: this.rating, reviewFeedback: this.review, jobRequestId: this.jobRequestId }).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(reviews => {
        this.navCtrl.setRoot("TabsPage", { tabIndex: 1, tabTitle: "SmartieSearch", role: this.role });
      })
    });
  }

}
