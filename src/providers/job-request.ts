import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../app/app.data';

/*
  Generated class for the JobRequstProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JobRequestProvider {
  notifyCount: number = 0;
  hasUpcomings: boolean = false;
  upcomingCount: number = 0;
  jobRequestState: any;
  constructor(public http: HttpClient, public dataService: DataService) {
    this.jobRequestState = {"fresh": 1, "requested": 2, "accepted": 3, "paidAndUpcoming": 4, "scheduled": 5, "completed": 6}
  }

  getNotificationCounts(body) {
    this.notifyCount = 0;
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

  sanitizeNotifications(notifications: any) {
    // TODO: when these are more than just jobReqs
    // console.log(notifications);
    return new Promise(resolve => {
      let activeJobReqs = [];
      notifications.map(notification => {
        if (notification.jobRequestState != 1) {
          activeJobReqs.push(notification);
        }
      });
      if (activeJobReqs.length > 0) {
        for (let activeJob of activeJobReqs) {
          notifications.forEach((notification, ix) => {
            if (notification.teacherProfile && notification.otherProfile && activeJob.otherProfile) {
              // if (notification.teacherProfile.objectId == activeJob.teacherProfile.objectId &&
              //   notification.otherProfile.objectId == activeJob.otherProfile.objectId &&
              //   (notification.requestSent == false && notification.acceptState == false)) {
              //   notifications.splice(ix, 1);
              // }
              if(notification.jobRequestState != 1){
                notifications.splice(ix, 1);
              }
            }
            if (ix >= notifications.length - 1) {
              resolve(notifications);
              // console.log(notifications);
              this.resetJobReq(this.checkjobReqForCompleted(activeJobReqs));
            }

          });
        }
      } else {
        resolve(notifications);
        console.log(notifications);
      }
    });
  }
  checkjobReqForCompleted(jobReqs) {
    console.log(jobReqs);
    let x = 0;
    let resetJob = [];
    if (jobReqs.length>0){
      for(var i=0; i<jobReqs.length; i++){
        for(var k=0; k<jobReqs[i].schedule.length; k++){
          if(new Date(jobReqs[i].schedule[k].apptEndDateTime.iso) > new Date()){
            x = 0;
            break;
          }else if(new Date(jobReqs[i].schedule[k].apptEndDateTime.iso) < new Date()){
            x++;
          }
        }
        if(x == jobReqs[i].schedule.length){
          resetJob.push(jobReqs[i].objectId)
        }
      }
    }
    return resetJob;
  }
  resetJobReq(jobIds) {
    console.log(jobIds);
    if(jobIds.length>0){
      this.dataService.getApi("setJobReqToFresh", {"jobId":jobIds}).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
          console.log(resp);
        }, err => {
          console.log(err);
        })
      })
    }
  }

}
