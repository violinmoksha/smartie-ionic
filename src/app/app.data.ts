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

  httpPost(url, body, header) {
    // NB; linter dosnt like it, so not sure I see the usefulness in this TS context?
    //let self = this;
    return <any>new Promise((resolve, reject) => {
      this.http.post(url, body, header).then((res) => {
        resolve(JSON.parse(res.data)); // it's here if it's here
      }, err => {
        console.log("Api call failed: " + JSON.stringify(err))
        reject(err);
      })
    })
  }

  getApi(endPoint, body) {
    return new Promise((resolve, reject) => {
      this.storage.get('UserProfile').then(userData => {
        this.storage.get('Provision').then(provisionData => {
          const ourBaseUrls = Constants.API_ENDPOINTS.baseUrls;
          const ourHeaders = Constants.API_ENDPOINTS.headers;
          const ourEnv = Constants.API_ENDPOINTS.env;

          if (ourEnv === 'local' || ourEnv === 'test') {
            (ourEnv === 'test') ?
              this.baseUrl = ourBaseUrls.test :
              this.baseUrl = ourBaseUrls.local;
            this.applicationId = ourHeaders.localAndTest.applicationId;
          } else if (Constants.API_ENDPOINTS.env === 'prod') {
            this.baseUrl = ourBaseUrls.prod;
            this.applicationId = ourHeaders.prod.applicationId;
          }
          this.contentType = 'application/json';

          const httpOptions = {
            'X-Parse-Application-Id': this.applicationId,
            'X-Hullo-Token': (provisionData && provisionData.pToken) ? provisionData.pToken : '',
            'x-Device-UUID': (provisionData && provisionData.provision) ? provisionData.provision.uuid : '',
            'X-Bouncy-Token': userData ? userData.jwtToken : '',
            'X-User-Id': userData ? userData.userData.objectId : '',
            'Content-Type': this.contentType
          };

          this.http.setDataSerializer('utf8');

          resolve({
            "apiUrl": this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint,
            "apiBody": JSON.stringify(body),
            "apiHeaders": httpOptions
          });
        }, error => {
          reject(error);
        })
      }, error => {
        reject(error);
      });
    })
  }

  // TODO: needs further testing in real device
  getUserkey() {
    let newKey = crypto.randomBytes(32).toString('base64');
    return new Promise((resolve, reject) => {
      this.secureStorage.create('smartieKeys').then((ss: SecureStorageObject) => {
        /* remove == Illuminati (or us testing this) */
        //ss.remove('userkey').then(async data => {
        ss.get('userkey').then(data => {
          if (data.length == 44) {
            resolve(data);
          } else {
            // isnt here yet, so gen and store it
            ss.set('userkey', newKey).then(data => {
              ss.get('userkey').then(data => {
                resolve(data);
              }, error => {
                reject(error);
              });
            }, error => {
              reject(error);
            })
          }
        }, error => {
          // isnt here yet, so gen and store it
          ss.set('userkey', newKey).then(data => {
            ss.get('userkey').then(data => {
              resolve(data);
            }, error => {
              reject(error);
            })
          }, error => {
            reject(error);
          })
        });
        // }, error => {
        //   console.log('here4 '+error);
        //   return error;
        // });
      });
    });
  }

  getBeyondGDPR(encryptOrDecrypt, body) {
    return new Promise((resolve, reject) => {
      if (Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch == true) {
        resolve(false); // NB: resolve so as not to interrupt exec flow (true chickenSwitch)
      } else {
        this.getUserkey().then(userkey => {
          body.userkey = userkey;

          const headers = {
            'Content-Type': 'application/json'
          };

          const endPoint = encryptOrDecrypt == true ?
            Constants.API_ENDPOINTS.beyondGDPR.paths.encrypt :
            Constants.API_ENDPOINTS.beyondGDPR.paths.decrypt;

          resolve({
            "apiUrl": Constants.API_ENDPOINTS.beyondGDPR.baseUrl + endPoint,
            "apiBody": body,
            "apiHeaders": headers
          });
        }, error => {
          // rejecting this inner error so that outer UI has access for ionic alertCtrl
          reject(error);
        });
      }
    });
  }

  sanitizeNotifications(notifications: any) {
    // TODO: when these are more than just jobReqs
    return new Promise(resolve => {
      let activeJobReqs = [];
      notifications.map(notification => {
        if (notification.requestSent == true || notification.acceptState == true) {
          activeJobReqs.push(notification);
        }
      });
      if (activeJobReqs.length > 0) {
        for (let activeJob of activeJobReqs) {
          notifications.forEach((notification, ix) => {
            if (notification.teacherProfile && notification.otherProfile && activeJob.otherProfile) {
              if (notification.teacherProfile.objectId == activeJob.teacherProfile.objectId &&
                notification.otherProfile.objectId == activeJob.otherProfile.objectId &&
                (notification.requestSent == false && notification.acceptState == false)) {
                notifications.splice(ix, 1);
              }
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

  updateUserProfileStorage(updatedProfile = null, specificUserData = null) {
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(profile => {
        if (updatedProfile) {
          profile['profileData'] = updatedProfile;
        }
        if (specificUserData != null) {
          profile['specificUser'] = specificUserData;
        }
        this.storage.set("UserProfile", profile).then(() => {
          resolve(profile);
        })
      }, err => {
        reject(err);
      })
    });
  }
}
