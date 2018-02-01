import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

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
          this.storage.set(data.result.profileData.role+'UserProfile', JSON.stringify(data.result)).then(profile => {
            this.storage.set('role', data.result.profileData.role);
            this.storage.set('sessionToken', data.result.userData.sessionToken);

            let API = this.smartieApi.getApi(
              'getJobRequests',
              { profileId: data.result.profileData.objectId, role: data.result.profileData.role }
            );

            return new Promise(resolve => {
              interface Response {
                result: any
              };
              this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(jobRequests => {
                localStorage.setItem(data.result.profileData.objectId + 'notificationCount', jobRequests.result.length);
                this.navCtrl.push("TotlesSearch", { role: data.result.profileData.role, fromWhere: 'login', loggedProfileId: data.result.profileData.objectId, jobRequests: jobRequests.result  });
              }, err => {
                console.log(err);
              });
            });
          });
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Login Failed !',
            subTitle: "Please check your credentials !",
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

  pushRegister(){
    this.navCtrl.push("RegisterPage");
  }

  pushForgotPassword(){
    this.navCtrl.push("ForgotPassword");
  }
}
