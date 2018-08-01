import { Response } from './../data-model/data-model';
import { Firebase } from '@ionic-native/firebase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { SmartieAPI } from '../api/smartie';
// import { App } from "ionic-angular";
import {NavController, App} from "ionic-angular";
// import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  private navCtrl: any;
  private notificationActions:any;

  constructor(public http: HttpClient,private firebase: Firebase,private device: Device,private smartieApi: SmartieAPI, private app:App) {


    console.log('Hello FirebaseProvider Provider');

    this.notificationActions = {
      PaymentReminder: "PaymentReminder",
      JobRequest: "JobRequest"
    };
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
    let navCtrl = this.app.getActiveNav();
    //perform action based notification's action
    switch (notificaitonData.eventAction) {
      case this.notificationActions.PaymentReminder:
        navCtrl.push("AddPaymentPage");
      break;
      case this.notificationActions.JobRequest:
      let job = JSON.parse(notificaitonData.extraData);
      this.openJobReq(job.jobId);
      // navCtrl.push("NotificationFeedPage", notificaitonData.extraData);
      break
      default:
        break;
    }
  }

  openJobReq = async (id)=>{
    let navCtrl = this.app.getActiveNav();
    let params={
      "jobRequestId":id
    }
      let API = await this.smartieApi.getApi(
        'getJobRequestById',
        params
      );
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(data=>{
        navCtrl.push("JobRequestPage", data);
      },err=>{
        console.log(err);
      })

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
