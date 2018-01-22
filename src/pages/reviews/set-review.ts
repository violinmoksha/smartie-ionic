import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the SetReviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-set-review',
  templateUrl: 'set-review.html',
})
export class SetReview {

  private params: any;
  private ReviewForm : FormGroup;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private smartieApi: SmartieAPI) {
    this.params = navParams.data;

    console.log(this.params);

    this.ReviewForm = this.formBuilder.group({
      review: ['', Validators.required],
      rating: ['']
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
  }

  ReviewSubmit(ReviewData){
    // TODO: commented for a clean LINT, for now, pls proceed
    let currUserRole = localStorage.getItem('loggedUserRole');
    let currProfile = JSON.parse(localStorage.getItem(currUserRole + 'UserProfile'));
    console.log(currProfile);

    this.body = { reviewedProfileId: this.params.profileData.objectId, reviewingProfileId: currProfile.profileData.objectId, reviewStars: ReviewData.rating, reviewFeedback: ReviewData.review }

    let API = this.smartieApi.getApi(
      'setReview',
      this.body
    );

    return new Promise(resolve => {
      interface Response {
        status: number
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        this.navCtrl.push("Reviews", this.params.profileData);
      })

    })
  }

}
