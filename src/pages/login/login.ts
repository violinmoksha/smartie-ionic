import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Register } from '../register/register';
import { ForgotPassword } from '../forgot-password/forgot-password';
import { TotlesSearch } from '../totles-search/totles-search';
import { TeacherJobAccepted } from '../teacher-job-accepted/teacher-job-accepted';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage, private smartieApi: SmartieAPI) {

    this.LoginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(data){
    if(data.username !== '' && data.password !==''){

      let API = this.smartieApi.getApi(
        'loginUser',
        {username: data.username.toLowerCase(), password: data.password}
      );

      return new Promise(resolve => {
        interface Response {
          result: any
        }
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(data => {
          localStorage.setItem(data.result.profileData.role+'UserProfile', JSON.stringify(data.result));
          localStorage.setItem('UserLoggedProfile', data.result.profileData.role);

          this.storage.set('role', data.result.profileData.role);
          this.storage.set('sessionToken', data.result.userData.sessionToken);

          if(data.result.profileData.role !== 'teacher'){
            // this.isAnyJobAccepted();
            // let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.getNotifyCount;
            let API = this.smartieApi.getApi(
              'getNotifyCount',
              { requestedProfileId: data.result.profileData.objectId, role: data.result.profileData.role }
            );

            return new Promise(resolve => {
              this.smartieApi.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(notifyRes => {
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', JSON.stringify(notifyRes));
                this.navCtrl.push(TotlesSearch, { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId });
              }, err => {
                console.log(err);
              })
            })
          }else{
            let API = this.smartieApi.getApi(
              'getNotifyCount',
              { requestingProfileId: data.result.profileData.objectId, role: data.result.profileData.role }
            );

            return new Promise(resolve => {
              this.smartieApi.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(notifyRes => {
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', JSON.stringify(notifyRes));
                this.navCtrl.push(TotlesSearch, { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId  });
              }, err => {
                console.log(err);
              })
            })
          }
        },
        err => {
          let loginError = err.error;
          // console.log(signupError);
          let alert = this.alertCtrl.create({
            title: 'Login Failed !',
            subTitle: loginError.error.split(':')[2].split(/[0-9]{3}\s/g)[1],
            buttons: ['OK']
          });
          alert.present();
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
    let API = this.smartieApi.getApi(
      'getAcceptedJobRequest',
      {requestingProfileId : '5ibpC33sTC', requestedProfileId: 'yKkVUDcRIO'}
    );

    return new Promise(resolve => {
      interface Response {
        status: number,
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
        if(res.status == 200){
          localStorage.setItem('TeacherJobAcceptedResult', JSON.stringify(res.result));
          this.navCtrl.push(TeacherJobAccepted);
        }
      }, err => {
        console.log(err);
      })
    })
  }

  pushRegister(){
    this.navCtrl.push(Register);
  }

  pushForgotPassword(){
    this.navCtrl.push(ForgotPassword);
  }
}
