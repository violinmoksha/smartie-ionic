import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { resolve } from 'dns';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import crypto from 'crypto';

/*
  Generated class for the DbserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbserviceProvider {

  constructor(public http: HttpClient, public storage: Storage, private secureStorage: SecureStorage) {
    console.log('Hello DbserviceProvider Provider');

  }

  async getUser(){
    return await this.storage.get("UserProfile").then(user=>{
      if(user){
        return user;
      }else{
        return false;
      }
    });
  }

  async getRegistrationData(){
    return await this.storage.get("Registration").then(data=>{
      if(data){
        return data;
      }else{
        return false;
      }
    });
  }

  async setRegistrationData(data){
    /** Data should be step:value(number), data:value(form data), role:userRole; step is registration steps value */
     this.storage.set("Registration", data);
  }

  deleteUser(){
    this.storage.remove("UserProfile");
  }

  async getProvision(){
    return await this.storage.get("Provision").then(provision => {
      if (provision) {
        return provision;
      } else {
        return false;
      }
    });
  }

  async getUserkey(){
    return new Promise((resolve, reject) => {
      this.secureStorage.create('smartieKeys').then((ss: SecureStorageObject) => {
        /* remove == Illuminati (or us e2e testing this) */
        //ss.remove('userkey').then(data => {
          ss.get('userkey').then(data => {
            resolve(data);
          }, error => {
            // isnt here yet, so gen and store it
            ss.set('userkey', crypto.randomBytes(32).toString('base64')).then(data => {
              ss.get('userkey').then(data => {
                resolve(data);
              }, error => {
                reject(error);
              })
            }, error => {
              reject(error);
            })
          });
        //}, error => {
          //console.log('here4 '+error);
          //reject(error);
        //});
      });
    });
  }
}
