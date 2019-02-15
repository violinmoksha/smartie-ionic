import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
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
  public genericAvatar: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public dataService: DataService, private analytics: AnalyticsProvider) {
    this.analytics.setScreenName("Reviews");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Reviews", "View"));

    this.params = navParams.get('params');
    console.log("### Getting params ####");
    console.log(this.params);

    if (this.params.role != 'teacher') {
      this.reviewedProfileId = this.params.otherProfile.objectId;
      this.profileData = this.params.otherProfile;
        this.genericAvatar = '/assets/imgs/user-img-student.png';
    } else {
      if(this.params.profileData){
        this.reviewedProfileId = this.params.profileData.objectId;
        this.profileData = this.params.profileData;
        this.genericAvatar = '/assets/imgs/user-img-teacher.png';
      }else{
        this.reviewedProfileId = this.params.teacherProfile.objectId;
        this.profileData = this.params.teacherProfile;
        this.genericAvatar = '/assets/imgs/user-img-teacher.png';
      }
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    });
  }

  ionViewDidLoad() {

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getReviews',
        { reviewedProfileId: this.reviewedProfileId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          this.reviews = response.result;
          this.reviewCount = this.reviews.length;
          /*this.profileData = userReviews.reviewedProfile;

          for (let review of userReviews.reviews) {
            this.getReviewingProfileData(review);
          }*/

        })
      });
    })
  }

  /*async getReviewingProfileData(review) {
    return new Promise(async (resolve) => {
      return await await this.dataService.getApi(
        'getReviewingProfile',
        { reviewingProfileId: review.reviewingProfileId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          if (response.result.reviewingProfile.profilePhoto) { /// ???
            this.profilePhoto = response.result.reviewingProfile.profilePhoto.url;
          } else {
            this.profilePhoto = "./assets/img/user-round-icon.png";
          }
          this.reviews.push({ 'fullname': response.result.reviewingProfile.fullname, 'role': response.result.reviewingProfile.role, 'reviewStars': review.reviewStars, 'reviewFeedback': review.reviewFeedback, profilePhoto: this.profilePhoto })
        })
      });
    })
  }*/

  addReview() {
    this.navCtrl.push("SetReviewPage", { profileData: this.profileData });
  }

}
