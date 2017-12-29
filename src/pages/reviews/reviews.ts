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
  private reviews: any;
  private reviewCount: any;
  private profileData: any;
  private loggedUserName: any;
  private loggedRole: any;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public smartieApi: SmartieAPI) {
    this.reviewId = navParams.data.requestedId;
    this.loggedUserName = navParams.data.fullname;
    this.loggedRole = navParams.data.loggedRole;
  }

  ionViewDidLoad() {

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
        this.reviews = userReviews.reviews;
        this.reviewCount = this.reviews.length;
        this.profileData = userReviews.reviewedProfile;
        console.log(this.reviews);
      }, err => {
        console.log(err);
      })
    })

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

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getReviews;
    let headers = new Headers();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);

    this.body = { reviewedProfileId: this.params.profileData.objectId }

    this.http.post(postUrl, this.body, { headers: headers }).toPromise().then((res) => {
      let userReviews = JSON.parse(res.text());
      this.reviews = userReviews.result;
      console.log(this.reviews);
    })*/
  }

  addReview(){
    this.navCtrl.push(SetReview, { profileData : this.profileData });
  }

}
