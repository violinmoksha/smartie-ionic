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
  requestedsCount: number = 0;
  acceptedsCount: number = 0;

  constructor(public http: HttpClient, public dataService: DataService) {
    console.log('Hello JobRequstProvider Provider');
  }

  getNotificationCounts(body) {
    Promise.all(
      [this.getAllAccepteds(body),
      this.getAllUpcomings(body),
      this.getAllRequesteds(body)]
    ).then(values => {
      console.log(values)
    },  err => {
      console.log(err);
    })
  }
  getAllRequesteds(body) {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllRequesteds',
        body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          this.requestedsCount = 0;
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed == 0){
                this.requestedsCount++;
              }
            }
            resolve(this.requestedsCount);
          }

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
          this.acceptedsCount = 0;
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed != 0 && body.profileId == result.sentBy.objectId && result.viewed != 2){
                this.acceptedsCount++
              }
            }
            resolve(this.acceptedsCount);
          }
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
            resolve(response.result.length);
          } else {
            reject(response);
          }
        }, err => {
          console.log(err);
        })
      });
    })
  }

}
