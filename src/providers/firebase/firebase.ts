import { Firebase } from '@ionic-native/firebase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { SmartieAPI } from '../api/smartie';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient,private firebase: Firebase,private device: Device,private smartieApi: SmartieAPI) {
    console.log('Hello FirebaseProvider Provider');
  }


  initFCM=()=>{
    this.firebase.getToken()
  .then(token => {
    console.log(`The token is ${token}`);
    this.updateFcmToken(token);
}
) // save the token server-side and use it to push notifications to this device
  .catch(error => console.error('Error getting token', error));
  }


  updateFcmToken=(token=null, isActive=null)=>{

    let params={
      "deviceId":this.device.uuid,
      // "platform":this.device.platform.toLowerCase(),
      "fcmToken":token,
      "isActive":isActive
    }
    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'updateFcmToken',
        params
      );
  
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(data=>{
        console.log(data);
      })
    })
  }

}
