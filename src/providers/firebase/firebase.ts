import { Firebase } from '@ionic-native/firebase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { SmartieAPI } from '../api/smartie';
// import { App } from "ionic-angular";
import {NavController, App} from "ionic-angular/index";
// import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  private navCtrl: NavController;
  constructor(public http: HttpClient,private firebase: Firebase,private device: Device,private smartieApi: SmartieAPI, private app:App) {
    this.navCtrl = app.getActiveNav();
    console.log('Hello FirebaseProvider Provider');
  }


  initFCM() {
    this.firebase.getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        this.updateFcmToken(token);
      }).catch(error => console.error('Error getting token', error));

    /* this.firebase.onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        this.updateFcmToken(token);
      }); */
  }

  notificationListener = ()=>{
    this.firebase.onNotificationOpen().subscribe((notification:any)=>{
      console.log(notification);
      this.notificationHandler(notification);
    })

  }

  notificationHandler = (notificaitonData)=>{

    //perform action based notification's action
    switch (notificaitonData.eventAction) {
      case "PaymentReminder":
        alert("setup payment");
        this.navCtrl.push("AddPaymentPage");
        break;

      default:
        break;
    }
  }


  updateFcmToken=(token=null, isActive=null)=>{

    let params={
      "deviceId":this.device.uuid,
      "platform":this.device.platform.toLowerCase(),
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
