import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { SmartieAPI } from '../../providers/api/smartie';
import { Reviews } from '../reviews/reviews';

/**
 * Generated class for the SetReviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-set-review',
  templateUrl: 'set-review.html',
})
export class SetReview {

  private params: any;
  private ReviewForm : FormGroup;
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private http: Http) {
    this.params = navParams.data;

    console.log(this.params);

    this.ReviewForm = formBuilder.group({
      review: ['', Validators.required],
      rating: ['']
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
  }

  ReviewSubmit(ReviewData){
    var currUserRole = localStorage.getItem('loggedUserRole');
    var currProfile = JSON.parse(localStorage.getItem(currUserRole + 'userProfile'));

    /*if(Constants.API_ENDPOINTS.env === 'local'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.local;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'test'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.test;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.prod;
      this.applicationId = Constants.API_ENDPOINTS.headers.prod.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.prod.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.prod.contentType;
    }

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.setReview;
    let headers = new Headers();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);

    this.body = { reviewedProfileId: this.params.profileData.objectId, reviewingProfileId: currProfile.profileData.objectId, reviewStars: ReviewData.rating, reviewFeedback: ReviewData.review }

    this.http.post(postUrl, this.body, { headers: headers }).toPromise().then((res) => {
      this.navCtrl.push(Reviews, { profileData : this.params.profileData });
    }) */
  }

}
