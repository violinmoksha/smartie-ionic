import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { SetReview } from './set-review';

/**
 * Generated class for the ReviewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-reviews',
  templateUrl: 'reviews.html',
})
export class Reviews {

  private reviewId: any;
  private reviews: any = [];
  private reviewCount: any;
  private profileData: any;
  private loggedUserName: any;
  private loggedRole: any;
  private body: any;
  private profilePhoto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public smartieApi: SmartieAPI) {
    if(navParams.data.objectId){
      this.reviewId = navParams.data.objectId;
    }else{
      this.reviewId = navParams.data.requestedId;
    }
    this.loggedUserName = navParams.data.fullname;
    this.loggedRole = navParams.data.loggedRole;
  }

  ionViewDidLoad() {
    console.log(this.reviewId);

    this.body = { reviewedProfileId: this.reviewId }

    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getReviews',
        this.body
      );
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        let userReviews = response.result;
        this.reviewCount = userReviews.reviews.length;
        this.profileData = userReviews.reviewedProfile;

        for(let review of userReviews.reviews){
          this.getReviewingProfileData(review);
        }
      }, err => {
        console.log(err);
      })
    })
  }

  getReviewingProfileData(review){
    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getReviewingProfile',
        { reviewingProfileId: review.reviewingProfileId}
      );
      interface Response {
        result: any
      }
      return this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
        if(response.result.reviewingProfile.profilePhoto){
          this.profilePhoto = response.result.reviewingProfile.profilePhoto.url;
        }else{
          this.profilePhoto = "./assets/img/user-round-icon.png";
        }
        this.reviews.push({ 'fullname': response.result.reviewingProfile.fullname, 'role':  response.result.reviewingProfile.role, 'reviewStars': review.reviewStars, 'reviewFeedback': review.reviewFeedback, profilePhoto: this.profilePhoto })
      })
    })
  }

  addReview(){
    this.navCtrl.push(SetReview, { profileData : this.profileData });
  }

}
