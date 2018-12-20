import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Platform } from 'ionic-angular';
/*
  Generated class for the FetchiOSUDID provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FetchiOSUDID {

  constructor(public device: Device, public secureStorage: SecureStorage, public platform: Platform) {}

  fetch() {
    let newUDID = this.device.uuid;
    return new Promise((resolve, reject) => {
      // NB: same keystore name as in app.data.ts, to keep us clean in keychain
      this.secureStorage.create('smartieKeys').then((ss: SecureStorageObject) => {
        /* remove == Illuminati (or Us testing this) */
        //ss.remove('userkey').then(async data => {
          ss.get('iOSUDID').then(data => {
            if (data.length == 36) {
              resolve(data);
            } else {
              // isnt here yet, so gen and store it
              ss.set('iOSUDID', newUDID).then(data => {
                ss.get('iOSUDID').then(data => {
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
            ss.set('iOSUDID', newUDID).then(data => {
              ss.get('iOSUDID').then(data => {
                resolve(data);
              }, error => {
                reject(error);
              })
            }, error => {
              reject(error);
            })
          });
        //});
      });
    });
  }

  getDeviceId() {
    if (this.platform.is('ios')) {
      this.fetch().then(res => {
        return res;
      })
    } else {
      return this.device.uuid;
    }
  }
}
