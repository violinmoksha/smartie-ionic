import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { DataService } from '../app/app.data';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  profile: any;
  studentProfileId: any;
  teacherProfileId: any;
  allMessages = [];

  constructor(public http: HttpClient, public dataService: DataService, public events: Events) {
    // console.log('Hello ChatProvider Provider');
  }

  initializebuddy(profile) {
    this.profile = profile;

    if(this.profile.role != 'teacher'){
      this.studentProfileId = this.profile.objectId;
      this.teacherProfileId = this.profile.teacherProfile.objectId;
    }else{
      this.teacherProfileId = this.profile.objectId;
      this.studentProfileId = this.profile.otherProfile.objectId;
    }
  }

  addnewmessage(msg) {
    if (this.profile) {

      console.log(this.studentProfileId);
      console.log(this.teacherProfileId);

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'addChatMessage',
          { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId, message: msg, viewed: false, role: this.profile.role }
        ).then(async API => {
          return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(async response => {
            resolve(response);
          }, err => {
            console.log(err);
          })
        });
      });
    }
  }

  getAllMessages() {
    console.log(this.studentProfileId);
    console.log(this.teacherProfileId);

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllMessages',
        { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId }
      ).then(async API => {
        return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(async response => {
          this.allMessages = [];
          for(let chat of response[0].result){
            this.allMessages.push(chat);
          }
          // this.allMessages = response.result;
          this.events.publish('newmessage');
        }, err => {
          console.log(err);
        })
      });
    })
  }

}
