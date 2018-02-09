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
          this.storage.set('UserProfile', data.result).then(UserProfile => {
            // TODO server-side fetchNotifications endpoint
            // to return: all notifications including jobRequests
            let API = this.smartieApi.getApi(
              'fetchNotifications',
              { profileId: UserProfile.profileData.objectId, role: UserProfile.profileData.role }
            );

            return new Promise(resolve => {
              interface Response {
                result: any
              };
              this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
                //console.log(JSON.stringify(Notifications));
                this.navCtrl.push("SmartieSearch", { role: UserProfile.profileData.role, fromWhere: 'login', loggedProfileId: UserProfile.profileData.objectId, notifications: Notifications.result });
              }, err => {
                console.log(err);
              });
            });
          });
        },
        err => {
          this.loginFailed();
        });
      });
    }else{
      this.loginFailed();
    }
  }

  loginFailed(){
    let alert = this.alertCtrl.create({
      title: 'Login Failed !',
      subTitle: 'Please use your credentials !',
      buttons: ['OK']
    });
    alert.present();
  }

  pushRegister(){
    this.navCtrl.push("RegisterPage");
  }

  pushForgotPassword(){
    this.navCtrl.push("ForgotPassword");
  }
}
