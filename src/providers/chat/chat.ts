import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { SmartieAPI } from '../api/smartie';

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

  constructor(public http: HttpClient, public smartieApi: SmartieAPI, public events: Events) {
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
        let API = await this.smartieApi.getApi(
          'addChatMessage',
          { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId, message: msg, viewed: false, role: this.profile.role }
        );

        interface Response {};
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
          resolve(response);
        }, err => {
          console.log(err);
        })
      });
    }
  }

  getAllMessages() {
    console.log(this.studentProfileId);
    console.log(this.teacherProfileId);

    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'getAllMessages',
        { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId }
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        this.allMessages = [];
        for(let chat of response.result){
          this.allMessages.push(chat);
        }
        // this.allMessages = response.result;
        this.events.publish('newmessage');
      }, err => {
        console.log(err);
      })
    })
  }

}

