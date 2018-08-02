import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
/**
 * Generated class for the ReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reviews',
  templateUrl: 'reviews.html',
})
export class ReviewsPage {

  params: any;
  reviewedProfileId: any;
  role: any;
  reviewCount: number;
  private profileData: any;
  profilePhoto: any;
  reviews: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI, private analytics: AnalyticsProvider) {
    this.analytics.setScreenName("Reviews");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Reviews", "View"));

    this.params = navParams.data.params;
    console.log(this.params);

    if (this.params.role != 'teacher') {
      this.reviewedProfileId = this.params.otherProfile.objectId;
    } else {
      this.reviewedProfileId = this.params.teacherProfile.objectId;
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    });
  }

  ionViewDidLoad() {
    console.log(this.reviewedProfileId);

    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'getReviews',
        { reviewedProfileId: this.reviewedProfileId }
      );
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
        console.log(response.result);
        let userReviews = response.result;
        this.reviewCount = userReviews.reviews.length;
        this.profileData = userReviews.reviewedProfile;

        for (let review of userReviews.reviews) {
          this.getReviewingProfileData(review);
        }

      })
    })
  }

  getReviewingProfileData(review) {
    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'getReviewingProfile',
        { reviewingProfileId: review.reviewingProfileId }
      );
      interface Response {
        result: any
      }
      return this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
        if (response.result.reviewingProfile.profilePhoto) {
          this.profilePhoto = response.result.reviewingProfile.profilePhoto.url;
        } else {
          this.profilePhoto = "./assets/img/user-round-icon.png";
        }
        this.reviews.push({ 'fullname': response.result.reviewingProfile.fullname, 'role': response.result.reviewingProfile.role, 'reviewStars': review.reviewStars, 'reviewFeedback': review.reviewFeedback, profilePhoto: this.profilePhoto })
      })

    })
  }

  addReview() {
    this.navCtrl.push("SetReviewPage", { profileData: this.profileData });
  }

}
