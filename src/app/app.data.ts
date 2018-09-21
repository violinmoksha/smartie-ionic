import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Constants } from './app.constants';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { HTTP } from '@ionic-native/http';
import crypto from 'crypto';

@Injectable()
export class DataService {
  baseUrl: string;
  applicationId: string;
  contentType: string;
  hostname: string;

  constructor(public storage: Storage, public secureStorage: SecureStorage, public http: HTTP) {
  }

  httpPost(url, body, header){
    let self = this;
    return <any> new Promise((resolve, reject)=>{
      debugger;
      this.http.post(url, body, header).then((res)=>{
        if(res.data){
          res.data = JSON.parse(res.data)
          resolve(res);
        }else{
          reject(res);
        }
        console.log("api resp: "+JSON.stringify(res));
      }, err=>{
        console.log("Api call failed: "+JSON.stringify(err))
        reject(err);
      })
    })
  }

  async getApi(endPoint, body) {
    return await this.storage.get('UserProfile').then(async userData => {
      return await this.storage.get('Provision').then(async provisionData => {
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
          'X-Parse-Application-Id': this.applicationId,
          'X-Hullo-Token': provisionData ? provisionData.pToken : '',
          'x-Device-UUID': provisionData ? provisionData.provision.uuid : '',
          'X-Bouncy-Token': userData ? userData.jwtToken : '',
          'X-User-Id': userData ? userData.userData.objectId : '',
          'Content-Type': this.contentType
        };

        this.http.setDataSerializer('utf8');

        let retObj = {
          "apiUrl": this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint,
          "apiBody": JSON.stringify(body),
          "apiHeaders": httpOptions
        };
        console.log(retObj);
        return await retObj;
      }, error => {
        return error;
      })
    }, error => {
      return error;
    });
  }

  // TODO: needs further testing in real device
  async getUserkey(){
    let newKey = crypto.randomBytes(32).toString('base64');
    return await this.secureStorage.create('smartieKeys').then(async (ss: SecureStorageObject) => {
      /* remove == Illuminati (or us testing this) */
      //ss.remove('userkey').then(async data => {
        return await ss.get('userkey').then(async data => {
          if (data.length == 44) {
            return await data;
          } else {
            // isnt here yet, so gen and store it
            return await ss.set('userkey', newKey).then(async data => {
              return await ss.get('userkey').then(async data => {
                return await data;
              });
            }, async error => {
              return await error;
            })
          }
        }, async error => {
          // isnt here yet, so gen and store it
          return await ss.set('userkey', newKey).then(async data => {
            return await ss.get('userkey').then(async data => {
              return await data;
            }, error => {
              return error;
            })
          }, async error => {
            return await error;
          })
        });
      // }, error => {
      //   console.log('here4 '+error);
      //   return error;
      // });
    });
  }

  async getBeyondGDPR(encryptOrDecrypt, body) {
    if (Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch == true) {
      return await false; // NB: resolve so as not to interrupt exec flow (true chickenSwitch)
    } else {
      return await this.getUserkey().then(async userkey => {
        body.userkey = userkey;

        const headers = {
          'Content-Type': 'application/json'
        };

        const endPoint = encryptOrDecrypt == true ?
          Constants.API_ENDPOINTS.beyondGDPR.paths.encrypt :
          Constants.API_ENDPOINTS.beyondGDPR.paths.decrypt;

        return await {
          "apiUrl": Constants.API_ENDPOINTS.beyondGDPR.baseUrl + endPoint,
          "apiBody": body,
          "apiHeaders": headers
        };
      }, async error => {
        // rejecting this inner error so that outer UI has access for ionic alertCtrl
        return await error;
      });
    }
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

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

}
