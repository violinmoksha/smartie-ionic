import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/app.constants';
// import { TeacherJobAccepted } from '../teacher-job-accepted/teacher-job-accepted';

/**
 * Generated class for the AllAcceptedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-all-accepteds',
  templateUrl: 'all-accepteds.html',
})
export class AllAccepteds {

  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;
  private allAccepteds: any;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
  }

  ionViewDidLoad() {
    if(Constants.API_ENDPOINTS.env === 'local'){
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

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getAllAccepteds;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Parse-Master-Key': this.masterKey,
        'Content-Type': this.contentType
      })
    };

    if(this.navParams.data.activeRole == 'teacher'){
      this.body = { requestingProfileId: JSON.parse(localStorage.getItem(this.navParams.data.activeRole+'userProfile')).profileData.objectId, role: this.navParams.data.activeRole }
    }else{
      this.body = { requestedProfileId: JSON.parse(localStorage.getItem(this.navParams.data.activeRole+'userProfile')).profileData.objectId }
    }

    return new Promise(resolve => {
      this.http.post(postUrl, JSON.stringify(this.body), httpOptions ).subscribe(res => {
        let notifyResult = res;
        this.allAccepteds = notifyResult.result;
        console.log(this.allAccepteds);
      })
    })
  }

  showJobAccept(requestingProfileId, requestedProfileId){
    if(Constants.API_ENDPOINTS.env === 'local'){
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

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getAcceptedJobRequest;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Parse-Master-Key': this.masterKey,
        'Content-Type': this.contentType
      })
    };
    let body = { requestingProfileId : requestingProfileId, requestedProfileId: requestedProfileId, role: this.navParams.data.activeRole }

    return new Promise(resolve => {
      this.http.post(postUrl, JSON.stringify(body), httpOptions ).subscribe(res => {
        let resResult = res;
      })
    })
  }

}
