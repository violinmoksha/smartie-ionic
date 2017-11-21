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
import { SmartieApiProvider } from '../../providers/smartie-api/smartie-api';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: HttpClient, private storage: Storage, private smartieApi: SmartieApiProvider) {

    this.LoginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(data){
    if(data.username !== '' && data.password !==''){

      let apiKeys = this.smartieApi.getApiKeys('loginUser');
      let body = {username: data.username, password: data.password};

      console.log(body);

      /// maybe???
      /*return new Promise(resolve => {

      })*/
      return new Promise(resolve => {
        this.http.post(apiKeys.apiUrl, JSON.stringify(body), apiKeys.apiHeaders ).subscribe(data => {
          console.log(data);
          localStorage.setItem(data.result.profileData.role+'userProfile', JSON.stringify(data.result));
          this.storage.set('sessionToken', data.result.userData.sessionToken);

          if(data.result.profileData.role !== 'teacher'){
            // this.isAnyJobAccepted();
            // let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
            let apiKeys = this.smartieApi.getApiKeys('getNotifyCount');

            let dataNotification = { requestedProfileId: data.result.profileData.objectId, role: data.result.profileData.role };

            return new Promise(resolve => {
              this.http.post(apiKeys.apiUrl, dataNotification, apiKeys.apiHeaders ).subscribe(notifyRes => {
                let notificationCount = notifyRes;
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', JSON.stringify(notificationCount));
                this.navCtrl.push(TotlesSearch, { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId });
              }, err => {
                console.log(err);
              })
            })
          }else{
            let apiKeys = this.smartieApi.getApiKeys('getNotifyCount');

            let dataNotification = { requestingProfileId: data.result.profileData.objectId, role: data.result.profileData.role };

            return new Promise(resolve => {
              this.http.post(apiKeys.apiUrl, dataNotification, apiKeys.apiHeaders ).subscribe(notifyRes => {
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
    let apiKeys = this.smartieApi.getApiKeys('getAcceptedJobRequest');
    let body = {requestingProfileId : '5ibpC33sTC', requestedProfileId: 'yKkVUDcRIO'}

    return new Promise(resolve => {
      this.http.post(apiKeys.apiUrl, body, apiKeys.apiHeaders ).subscribe(result => {
        if(result.status == 200){
          let requestedResponse = JSON.parse(result.text());
          localStorage.setItem('TeacherJobAcceptedResult', JSON.stringify(requestedResponse.result));
          this.navCtrl.push(TeacherJobAccepted);
        }
      }, err => {
        console.log(err);
      })
    })
  }

  pushItem(){
    this.navCtrl.push(Register);
  }

}
