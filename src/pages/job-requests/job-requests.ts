import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../app/app.constants';

/**
 * Generated class for the JobRequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-job-requests',
  templateUrl: 'job-requests.html',
})
export class JobRequests {

  private params: any;
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;
  private requestSent: boolean;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public http: HttpClient) {
    this.params = navParams.data;
  }

  ionViewDidLoad() {
    let roleProfile = JSON.parse(localStorage.getItem(this.params.loggedRole + 'userProfile'));

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

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getRequestedJobRequest;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Parse-Master-Key': this.masterKey,
        'Content-Type': this.contentType
      })
    };

    //TODO: if loggedin role is teacher - teacher is requesting and the markers on the screen are requested
    //TODO: if loggedin role is others - teacher is requesting and the loggedin other is request
    if(this.params.loggedRole === 'teacher'){
      this.body = { requestingProfileId: roleProfile.profileData.objectId, requestedProfileId: this.params.requestedId };
    }else{
      this.body = { requestingProfileId: this.params.requestedId, requestedProfileId: roleProfile.profileData.objectId };
    }

    return new Promise(resolve => {
      this.http.post(postUrl, JSON.stringify(this.body), httpOptions ).subscribe(response => {
        let resResult = response;
        if(resResult){
          this.requestSent = true;
        }else{
          this.requestSent = false;
        }
      }, err => {
        console.log(err);
      })
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  sendRequest(){
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

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.setJobRequest;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Parse-Master-Key': this.masterKey,
        'Content-Type': this.contentType
      })
    };

    if(this.params.loggedRole === 'teacher'){
      this.body = { requestingProfileId: JSON.parse(localStorage.getItem(this.params.loggedRole+'userProfile')).profileData.objectId, requestedProfileId: this.params.requestedId  };
    }else{
      this.body = { requestingProfileId: this.params.requestedId, requestedProfileId: JSON.parse(localStorage.getItem(this.params.loggedRole+'userProfile')).profileData.objectId  }
    }

    return new Promise(resolve => {
      this.http.post(postUrl, JSON.stringify(this.body), httpOptions ).subscribe(response => {
        if(response.status == 200){
          this.requestSent = true;
        }
        setTimeout(() => {
          this.viewCtrl.dismiss();
        }, 5000);
      })
    })

  }

}
