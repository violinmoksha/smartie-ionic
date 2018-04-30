import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';


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
  rating: any = '5';
  review: any = 'test12345';
  private reviewedProfileId: any;
  private reviewingProfileId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    console.log("dasd")
    this.profileData = navParams.data.profileData;
    this.reviewedProfileId = this.profileData.objectId;

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.reviewingProfileId = profile.profileData.objectId;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
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
