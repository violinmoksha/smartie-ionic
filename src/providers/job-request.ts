import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../app/app.data';
import { Events } from 'ionic-angular';
import { UtilsProvider } from './utils';
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
  jobScheduleReviewStaus: any;
  private reviewStatusBody: any;
  public scheduleStatus = {"upComing":"upcoming", "onGoing":'ongoing', "completed":'completed'};

  constructor(public http: HttpClient, public dataService: DataService, public utils: UtilsProvider, public events: Events) {
    this.jobRequestState = {"fresh": 1, "requested": 2, "accepted": 3, "paidAndUpcoming": 4, "scheduled": 5, "completed": 6};
    this.jobScheduleReviewStaus = {"fresh": 0, "completed": 1, "cancelled": 2};
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

  updatedScheduleStatus(schedules, reviewStatus, role){
    console.log({ scheduleIds: schedules, reviewStatus: reviewStatus });

    this.reviewStatusBody = { scheduleIds: schedules, reviewStatus: reviewStatus, role: role }


    this.dataService.getApi('updateReviewStatusInSchedule', this.reviewStatusBody ).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(jobSchedules => {
        console.log(jobSchedules);
      })
    })
  }

  sanitizeNotifications(notifications: any, appointment = null) {
    // TODO: when these are more than just jobReqs
    console.log(notifications);
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
              if(notification.jobRequestState != 1){
                notifications.splice(ix, 1);
              }
            }
            if (ix >= notifications.length - 1) {
              console.log("active Job Reqs");
              console.log(activeJobReqs);
              resolve(notifications);
              // this.utils.initAppRating();
              //this.handleReviewUpdates(activeJobReqs);
            }

          });
        }
        this.updateScheduleAndReq(this.checkjobScheduleForCompleted(activeJobReqs), appointment);
      } else {
        resolve(notifications);
        this.checkCompletedjobScheduleForReview(notifications, appointment);
        // console.log(notifications);
      }
    });
  }

  checkCompletedjobScheduleForReview(notifications, appointment){
    if(notifications.length > 0){
      this.utils.getCurrentUserData().then((currentUserData: any) => {
        let completeSchedules = [];
        for(let notification of notifications){
          console.log(notification);
          if(notification.schedule.length > 0){
            for(let schedule of notification.schedule){
              console.log(schedule);
              if(schedule.scheduleStatus == "completed" && currentUserData.profileData.role == "teacher" && schedule.teacherReviewStatus == 0){
                completeSchedules.push({id: schedule.objectId, teacherReviewStatus: schedule.teacherReviewStatus, studentReviewStatus: schedule.studentReviewStatus });
              }else if(schedule.scheduleStatus == "completed" && currentUserData.profileData.role == "student" && schedule.studentReviewStatus == 0){
                completeSchedules.push({id: schedule.objectId, teacherReviewStatus: schedule.teacherReviewStatus, studentReviewStatus: schedule.studentReviewStatus });
              }
            }
          }
        }
        console.log(completeSchedules);
        if(!appointment){
          if(completeSchedules.length > 0){
            this.events.publish("scheduleCompleted", completeSchedules);
          }
        }
      });
    }
  }

  checkjobReqForCompleted(jobReqs) {
    console.log(jobReqs);
    let x = 0;
    let resetJob = [];
    if (jobReqs.length > 0){
      for (let i=0; i<jobReqs.length; i++) {
        for (let k=0; k<jobReqs[i].schedule.length; k++) {
          if (jobReqs[i].schedule[k].scheduleStatus == this.scheduleStatus.completed) {
            x++;
          }
        }
        if (x == jobReqs[i].schedule.length) {
          resetJob.push(jobReqs[i].objectId);
        }
      }
    }
    return resetJob;
  }

  checkjobScheduleForCompleted(jobReqs) {
    console.log(jobReqs);
    let resetJob = [];

    let j;
    if (jobReqs.length > 0){
      for (let i=0; i<jobReqs.length; i++) {
        for (let k=0; k<jobReqs[i].schedule.length; k++) {
          for (j=0; j<jobReqs[i].schedule[k].appointmentTimings.length; j++) {
            let x = 0;
            if (new Date(jobReqs[i].schedule[k].appointmentTimings[j].apptStartDateTime) > new Date()){
              x = 0;
              break;
            } else if (new Date(jobReqs[i].schedule[k].appointmentTimings[j].apptEndDateTime) < new Date()) {
              x++;
            } else if ((new Date(jobReqs[i].schedule[k].appointmentTimings[j].apptStartDateTime) <= new Date()) && (new Date(jobReqs[i].schedule[k].appointmentTimings[j].apptEndDateTime) >= new Date())) {
              x = -1;
            }

            if (j == jobReqs[i].schedule[k].appointmentTimings.length - 1){
              console.log("Value of : " + x);
              if (x == jobReqs[i].schedule[k].appointmentTimings.length) {
                resetJob.push({id:jobReqs[i].schedule[k].objectId, completed:true, teacherReviewStatus: jobReqs[i].schedule[k].teacherReviewStatus, studentReviewStatus: jobReqs[i].schedule[k].studentReviewStatus });
                jobReqs[i].schedule[k].scheduleStatus = this.scheduleStatus.completed;
              } else if (x == -1) {
                resetJob.push({id:jobReqs[i].schedule[k].objectId, onGoing:true, teacherReviewStatus: jobReqs[i].schedule[k].teacherReviewStatus, studentReviewStatus: jobReqs[i].schedule[k].studentReviewStatus });
                jobReqs[i].schedule[k].scheduleStatus = this.scheduleStatus.onGoing;
              } else if (x == 0) {
                resetJob.push({id:jobReqs[i].schedule[k].objectId, upComing:true, teacherReviewStatus: jobReqs[i].schedule[k].teacherReviewStatus, studentReviewStatus: jobReqs[i].schedule[k].studentReviewStatus });
                jobReqs[i].schedule[k].scheduleStatus = this.scheduleStatus.upComing;
              }
            }
          }
        }
      }
    }
    //this.resetJobReq(this.checkjobReqForCompleted(jobReqs));
    return {"schedules":resetJob, "jobReqs":jobReqs};
  }

  resetJobReq(jobIds) {
    console.log(jobIds);
    if(jobIds.length>0){
      this.dataService.getApi("setJobReqToFresh", {"jobId":jobIds}).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
          console.log(resp);
          // this.events.publish("scheduleCompleted", resp);
        }, err => {
          console.log(err);
        })
      })
    }
  }

  updateScheduleAndReq(jobs, appointment) {
    console.log(jobs);
    if(jobs.schedules.length > 0){
      let completeSchedules = [];
      this.dataService.getApi("updateScheduleStatus", {"scheduleIds":jobs.schedules}).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
          console.log("updateScheduleStatus");
          console.log(resp);

          this.resetJobReq(this.checkjobReqForCompleted(jobs.jobReqs));

          this.utils.getCurrentUserData().then((currentUserData: any) => {
            for(let schedule of jobs.schedules){
              if(currentUserData.profileData.role == 'teacher'){
                if(schedule.completed && schedule.teacherReviewStatus == 0){
                  completeSchedules.push(schedule);
                }
              }else{
                if(schedule.completed && schedule.studentReviewStatus == 0){
                  completeSchedules.push(schedule);
                }
              }
            }
            console.log(completeSchedules);
            if(!appointment){
              if(completeSchedules.length > 0){
                this.events.publish("scheduleCompleted", completeSchedules);
              }
            }
          });

        }, err => {
          console.log(err);
        })
      });
    }
  }

  scheduleReviews(notifications){
    let completedSchedule = [];
    return new Promise(resolve => {
      console.log("JobRequest provider schedule reviews");
      console.log(notifications);
      for(let notification of notifications){
        if(notification.schedule){
          for(let appointment of notification.schedule){
            console.log("Each appointment");
            console.log(appointment);
            if(appointment.scheduleStatus == 'completed' && appointment.reviewStatus == 0){
              completedSchedule.push(appointment);
            }
          }
        }
      }
      if(completedSchedule.length > 0){
        resolve(completedSchedule);
      }
    });
  }

  /*handleReviewUpdates(jobReqs) {
    let alert = this.alertCtrl.create({
      title: 'Wow, check it out!',
      subTitle: `You have ${this.notifyCount} active job request(s)! Tap OK to visit your Notifications page!`,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.push("ViewAppointmentPage");
        }
      }]
    });
    alert.present();
  }*/

}
