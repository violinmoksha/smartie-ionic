import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  profile: any;
  receiverProfileId: any;
  constructor(public http: HttpClient, public smartieApi: SmartieAPI) {
    // console.log('Hello ChatProvider Provider');
  }

  initializebuddy(profile) {
    this.profile = profile;

    if(this.profile.role != 'teacher'){
      this.receiverProfileId = this.profile.otherProfileId;
    }else{
      this.receiverProfileId = this.profile.teacherProfileId;
    }
  }

  addnewmessage(msg, senderProfileId) {
    if (this.profile) {
      console.log(msg);
      console.log("Sender ID : " + senderProfileId);
      console.log("Receiver ID : " + this.receiverProfileId);

      return new Promise(resolve => {
        let API = this.smartieApi.getApi(
          'addChatMessage',
          { sender: senderProfileId, receiver: this.receiverProfileId, message: msg, viewed: false }
        );

        interface Response {};
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
          console.log(response);
        }, err => {
          console.log(err);
        })
      });

    }
  }

}
