import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
import { Pro } from '@ionic/pro';

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
                this.sanitizeNotifications(Notifications.result).then(notifications => {
                  this.navCtrl.push("SmartieSearch", { role: UserProfile.profileData.role, fromWhere: 'login', loggedProfileId: UserProfile.profileData.objectId, notifications: notifications });
                })
              }, err => {
                console.log(err);
              });
            });
          });
        },
        (err) => {
          Pro.monitoring.exception(err);
          this.loginFailed(err);
        });
      });
    }else{
      this.loginFailed(null);
    }
  }

  loginFailed(err){
    let alert;
    if (err) {
      alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: JSON.stringify(err),
        buttons: ['OK']
      });
    } else {
      alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: 'Please use your credentials !',
        buttons: ['OK']
      });
    }
    alert.present();
  }

  pushRegister(){
    this.navCtrl.push("RegisterPage");
  }

  pushForgotPassword(){
    this.navCtrl.push("ForgotPassword");
  }

  sanitizeNotifications(notifications:any){
    // TODO: when these are more than just jobReqs
    return new Promise(resolve => {
      let activeJobReqs = [];
      notifications.map(notification => {
        if (notification.requestSent == true
            || notification.acceptState == true) {
          activeJobReqs.push(notification);
        }
      });
      if (activeJobReqs.length > 0) {
        for(let activeJob of activeJobReqs) {
          notifications.forEach((notification, ix) => {
            if (notification.teacherProfile.objectId == activeJob.teacherProfile.objectId &&
                notification.otherProfile.objectId == activeJob.otherProfile.objectId &&
                (notification.requestSent == false && notification.acceptState == false) ) {
              notifications.splice(ix, 1);
            }
            if (ix >= notifications.length - 1) {
              resolve(notifications);
            }
          });
        }
      } else {
        resolve(notifications);
      }
    });
  }
}
