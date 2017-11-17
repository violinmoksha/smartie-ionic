import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: HttpClient, private storage: Storage) {

    this.LoginForm = this.formBuilder.group({
      username: [''],
      password: ['']
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
      let headers = new HttpHeaders();
      headers.append('X-Parse-Application-Id', this.applicationId);
      headers.append('X-Parse-Master-Key', this.masterKey);
      headers.append('Content-Type', this.contentType);
      let body = {username: data.username, password: data.password};

      /// maybe???
      /*return new Promise(resolve => {

      })*/
      this.http.post(postUrl, body, { headers: headers }).toPromise().then((res) => {
        let body = JSON.parse(res.text());
          localStorage.setItem(body.result.profileData.role+'userProfile', JSON.stringify(body.result))

        // console.log(body.result.userData.sessionToken);
        this.storage.set('sessionToken', body.result.userData.sessionToken);

        if(body.result.profileData.role !== 'teacher'){
          // this.isAnyJobAccepted();
          let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
          let headers = new HttpHeaders();
          headers.append('X-Parse-Application-Id', this.applicationId);
          headers.append('X-Parse-Master-Key', this.masterKey);
          headers.append('Content-Type', this.contentType);
          let data = { requestedProfileId: body.result.profileData.objectId, role: body.result.profileData.role };

          this.http.post(postUrl, data, { headers: headers }).toPromise().then((notifyRes) => {
            let notificationCount = JSON.parse(notifyRes.text());
            localStorage.setItem(body.result.profileData.objectId + 'notificationCount', JSON.stringify(notificationCount));
            this.navCtrl.push(TotlesSearch, { role: body.result.profileData.role, fromWhere: 'login', loggedProfileId: body.result.profileData.objectId });
          })

        }else{
          let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
          let headers = new HttpHeaders();
          headers.append('X-Parse-Application-Id', this.applicationId);
          headers.append('X-Parse-Master-Key', this.masterKey);
          headers.append('Content-Type', this.contentType);
          let data = { requestingProfileId: body.result.profileData.objectId, role: body.result.profileData.role };

          this.http.post(postUrl, data, { headers: headers }).toPromise().then((notifyRes) => {
            let notificationCount = JSON.parse(notifyRes.text());
            localStorage.setItem(body.result.profileData.objectId + 'notificationCount', JSON.stringify(notificationCount));
            this.navCtrl.push(TotlesSearch, { role: body.result.profileData.role, fromWhere: 'login', loggedProfileId: body.result.profileData.objectId  });
          })
        }
      })
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
