import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { DbserviceProvider } from '../dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { resolve } from 'dns';

/*
  Generated class for the SmartieAPI provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmartieAPI {
  private baseUrl: string;
  private applicationId: string;
  private contentType: string;

  constructor(public http: HttpClient, public storage: Storage, public dbService: DbserviceProvider, private alertCtrl: AlertController) {
  }

 async getApi(endPoint, body){
    let userData = await this.dbService.getUser();
    let provisionData = await this.dbService.getProvision();

    const ourBaseUrls = Constants.API_ENDPOINTS.baseUrls;
    const ourHeaders = Constants.API_ENDPOINTS.headers;
    const ourEnv = Constants.API_ENDPOINTS.env;

    if(ourEnv === 'local' || ourEnv === 'test'){
      (ourEnv === 'test') ?
        this.baseUrl = ourBaseUrls.test :
        this.baseUrl = ourBaseUrls.local;
      this.applicationId = ourHeaders.localAndTest.applicationId;
    } else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = ourBaseUrls.prod;
      this.applicationId = ourHeaders.prod.applicationId;
    }
    this.contentType = 'application/json';

    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Hullo-Token': provisionData ? provisionData.pToken : '',
        'x-device-uuid': provisionData ? provisionData.provision.uuid : '',
        'X-Bouncy-Token': userData ? userData.jwtToken : '',
        'x-user-id': userData ? userData.userData.objectId : '',
        'Content-Type': this.contentType
      })
    };

    return { apiUrl: this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint, apiBody: JSON.stringify(body), apiHeaders: httpOptions }
  }

  sanitizeNotifications(notifications:any){
    // TODO: when these are more than just jobReqs
    return new Promise(resolve => {
      let activeJobReqs = [];
      notifications.map(notification => {
        if (notification.requestSent == true || notification.acceptState == true) {
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

  updateUserProfileStorage(updatedProfile, specificUserData = null) {
    return new Promise(resolve => {
      this.storage.get("UserProfile").then(profile => {
        if (updatedProfile) {
          delete profile['profileData'];
          profile['profileData'] = updatedProfile;
        }
        if (specificUserData != null) {
          delete profile['specificUser'];
          profile['specificUser'] = specificUserData;
        }
        this.storage.set("UserProfile", profile).then(() => {
          resolve(profile);
        })
      })
    });
  }

  updateProvisionStorage(updatedProvision){
    return new Promise(resolve => {
      this.storage.get("Provision").then(provision => {
        if(updatedProvision){
          delete provision['provision'];
          provision['provision'] = updatedProvision;

          this.storage.set("Provision", provision).then(() => {
            resolve(provision);
          })
        }
      })
    })
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  showErrors(err){
    let alert;
    if (err.error.error.name == 'JsonWebTokenError') {
      alert = this.alertCtrl.create({
        title: 'Authentication Error',
        subTitle: 'You are not authorized to use this service',
        buttons: ['OK']
      });

      alert.present();
    }
  }
}
