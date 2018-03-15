import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';

/*
  Generated class for the SmartieAPI provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmartieAPI {
  private baseUrl: string;
  private applicationId: string;
  private contentType: string;

  constructor(public http: HttpClient) {
  }

  getApi(endPoint, body){
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
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'Content-Type': this.contentType
      })
    };

    return { apiUrl: this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint, apiBody: JSON.stringify(body), apiHeaders: httpOptions }
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
}
