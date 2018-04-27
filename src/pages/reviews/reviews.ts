import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI) {
    this.params = navParams.data.params;
    console.log(this.params);

    if(this.params.role != 'teacher'){
      this.reviewedProfileId = this.params.otherProfileId;
    }else{
      this.reviewedProfileId = this.params.teacherProfileId;
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    });
  }

  ionViewDidLoad() {
    console.log(this.reviewedProfileId);

    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getReviews',
        { reviewedProfileId: this.reviewedProfileId }
      );
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        console.log(response.result);
        this.reviewCount = response.result.reviews.length;
        this.profileData = response.result.reviewedProfile;
      })
    })
  }

  addReview(){
    this.navCtrl.push("SetReviewPage", { profileData: this.profileData });
  }

}
