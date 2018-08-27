import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Constants } from './app.constants';
import { HTTP } from '@ionic-native/http';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import crypto from 'crypto';

@Injectable()
export class DataService {
  baseUrl: string;
  applicationId: string;
  contentType: string;
  hostname: string;

  constructor(public storage: Storage, public http: HTTP, public secureStorage: SecureStorage) {
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

        /*let hostname = this.baseUrl.split('://')[1];
        if (hostname.search(':')) {
          hostname = hostname.split(':')[0];
        }*/
        const headers = {
          'X-Parse-Application-Id': this.applicationId,
          'X-Hullo-Token': provisionData ? provisionData.pToken : '',
          'x-Device-UUID': provisionData ? provisionData.provision.uuid : '',
          'X-Bouncy-Token': userData ? userData.jwtToken : '',
          'X-User-Id': userData ? userData.objectId : '',
          'Content-Type': this.contentType
        };
        /*for (let headerKey in Object.keys(headers)) {
          this.http.setHeader(hostname, headerKey, headers[headerKey]);
        }*/

        return await {
          "apiUrl": this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint,
          "apiBody": body,
          "apiHeaders": headers
        };
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
            return data;
          } else {
            // isnt here yet, so gen and store it
            return await ss.set('userkey', newKey).then(async data => {
              return await ss.get('userkey').then(async data => {
                return data;
              });
            }, error => {
              return error;
            })
          }
        }, async error => {
          // isnt here yet, so gen and store it
          return await ss.set('userkey', newKey).then(async data => {
            return await ss.get('userkey').then(data => {
              return data;
            }, error => {
              return error;
            })
          }, error => {
            return error;
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
      return false; // NB: resolve so as not to interrupt exec flow (true chickenSwitch)
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
      }, error => {
        // rejecting this inner error so that outer UI has access for ionic alertCtrl
        return error;
      });
    }
  }
}
