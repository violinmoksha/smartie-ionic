import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { resolve } from 'dns';

/*
  Generated class for the DbserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbserviceProvider {

  constructor(public http: HttpClient, public storage: Storage) {
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
}
