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
    return await this.storage.get("UserProfile").then((user)=>{
      if(user){
        return user;
      }else{
        return false;
      }
    });
  }

}
