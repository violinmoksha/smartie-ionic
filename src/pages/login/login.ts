import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from '../register/register';
import { TotlesSearch } from '../totles-search/totles-search';
import { TeacherJobAccepted } from '../teacher-job-accepted/teacher-job-accepted';
import { Constants } from '../../app/app.constants';
// import { Auth } from '@ionic/cloud-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  private LoginForm: FormGroup;
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: HttpClient, private storage: Storage) {

    this.LoginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(data){
    if(data.username !== '' && data.password !==''){
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

      let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.loginUser;
      /*let headers = new HttpHeaders();
      headers.append('X-Parse-Application-Id', this.applicationId);
      headers.append('X-Parse-Master-Key', this.masterKey);
      headers.append('Content-Type', this.contentType);*/
      const httpOptions = {
        headers: new HttpHeaders({
          'X-Parse-Application-Id': this.applicationId,
          'X-Parse-Master-Key': this.masterKey,
          'Content-Type': this.contentType
        })
      };
      let body = {username: data.username, password: data.password};

      console.log(body);

      /// maybe???
      /*return new Promise(resolve => {

      })*/
      return new Promise(resolve => {
        this.http.post(postUrl, JSON.stringify(body), httpOptions ).subscribe(data => {
          console.log(data);
          localStorage.setItem(data.result.profileData.role+'userProfile', JSON.stringify(data.result));
          this.storage.set('sessionToken', data.result.userData.sessionToken);

          if(data.result.profileData.role !== 'teacher'){
            // this.isAnyJobAccepted();
            let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
            const httpOptions = {
              headers: new HttpHeaders({
                'X-Parse-Application-Id': this.applicationId,
                'X-Parse-Master-Key': this.masterKey,
                'Content-Type': this.contentType
              })
            };
            let dataNotification = { requestedProfileId: data.result.profileData.objectId, role: data.result.profileData.role };

            return new Promise(resolve => {
              this.http.post(postUrl, dataNotification, httpOptions ).subscribe(notifyRes => {
                let notificationCount = notifyRes;
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', JSON.stringify(notificationCount));
                this.navCtrl.push(TotlesSearch, { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId });
              }, err => {
                console.log(err);
              })
            })
          }else{
            let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
            const httpOptions = {
              headers: new HttpHeaders({
                'X-Parse-Application-Id': this.applicationId,
                'X-Parse-Master-Key': this.masterKey,
                'Content-Type': this.contentType
              })
            };
            let dataNotification = { requestingProfileId: data.result.profileData.objectId, role: data.result.profileData.role };

            return new Promise(resolve => {
              this.http.post(postUrl, dataNotification, httpOptions ).subscribe(notifyRes => {
                let notificationCount = notifyRes;
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', JSON.stringify(notificationCount));
                this.navCtrl.push(TotlesSearch, { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId  });
              }, err => {
                console.log(err);
              })
            })
          }
        }, err => {
          console.log(err);
        });
      });
    }else{
      let alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: 'Please use your credentials !',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  isAnyJobAccepted(){
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
    let headers = new HttpHeaders();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);
    let body = {requestingProfileId : '5ibpC33sTC', requestedProfileId: 'yKkVUDcRIO'}

    return this.http.post(postUrl, body, { headers: headers }).toPromise().then((result) => {
      console.log(result);
      if(result.status == 200){
        let requestedResponse = JSON.parse(result.text());
        localStorage.setItem('TeacherJobAcceptedResult', JSON.stringify(requestedResponse.result));
        this.navCtrl.push(TeacherJobAccepted);
      }
    })


  }

  pushItem(){
    this.navCtrl.push(Register);
  }

}
