import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../app/app.data';

/*
  Generated class for the JobRequstProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JobRequstProvider {
  notifyCount: number = 0;
  hasUpcomings: boolean = false;
  upcomingCount: number = 0;
  constructor(public http: HttpClient, public dataService: DataService) {
    console.log('Hello JobRequstProvider Provider');
  }

  getNotificationCounts(body) {
    return new Promise((resolve, reject) => {
      Promise.all(
        [this.getAllAccepteds(body),
        this.getAllUpcomings(body),
        this.getAllRequesteds(body)]
      ).then(values => {
        resolve({"notifyCount": this.notifyCount, "hasUpcomings": this.hasUpcomings, "upcomingsCount": this.upcomingCount});
      }, err => {
        reject(err);
      })
    })
  }
  getAllRequesteds(body) {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllRequesteds',
        body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed == 0){
                this.notifyCount++;
              }
            }
          }
          resolve(response.result);
        }, err => {
          console.log(err);
        })
      });
    })
  }

  getAllAccepteds(body) {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllAccepteds',
        body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed != 0 && body.profileId == result.sentBy.objectId && result.viewed != 2){
                this.notifyCount++
              }
            }
          }
          resolve(this.notifyCount);
        })
      });
    })
  }

  getAllUpcomings(body) {
    return new Promise(async (resolve, reject) => {
      return await this.dataService.getApi(
        'getAllUpcomings',
        body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          if (response.result.length > 0) {
            this.upcomingCount = response.result.length; 
            this.notifyCount += response.result.length;
            this.hasUpcomings = true;
          }
          resolve(response.result.length);
        }, err => {
          console.log(err);
        })
      });
    })
  }

}
