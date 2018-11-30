import { FileTransfer } from '@ionic-native/file-transfer';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  private params: any;
  public role: any;
  private newmessage: any;
  private allmessages: any = [];
  public chatAccess: boolean = true;
  studentProfileId: any;
  teacherProfileId: any;
  chatMessages = [];
  navigateFrom: any;
  userId: any;
  sender: any;
  receiver: any;
  chatRoom:any;
  userProfileId:String;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, private dataService: DataService) {
    this.params = navParams.get("jobObject");
    this.sender = navParams.get("sender");
    this.receiver = navParams.get("receiver");
    this.navigateFrom = navParams.get("from");


    if (this.navigateFrom == "jobrequest") {
      if (!this.params.teacherProfile.stripeCustomer || this.params.teacherProfile.stripeCustomer == 'undefined') {
        this.chatAccess = true;
      }  
      if (this.params.role != 'teacher') {
        this.studentProfileId = this.params.objectId;
        this.teacherProfileId = this.params.teacherProfile.objectId;
      } else {
        this.teacherProfileId = this.params.objectId;
        this.studentProfileId = this.params.otherProfile.objectId;
      }
    }else{
      this.chatAccess = true;
      this.chatRoom = navParams.get('chat');
      this.receiver = this.chatRoom.receiver
      this.chatMessages = this.chatRoom.messages.reverse();
    }


    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.userId = profile.userData.objectId;
      this.userProfileId = profile.profileData.objectId;
    })

    this.scrollto();
  }

  onScroll(scrollEvent) {
    if (scrollEvent.scrollTop == 0) {
      console.log(this.allmessages.length);
      console.log("Almost reach top");
      this.getAllMessages(this.allmessages.length);
    }
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    console.log(this.chatAccess);
  }

  sendMessage() {
    console.log("sending message")
    if (this.navigateFrom == 'jobrequest') {
      this.dataService.getApi('getMyChatRoom', { roomId: this.teacherProfileId + '|' + this.studentProfileId }).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
          console.log(res);
          this.pushMessage(res.result.roomId);
        }, err => {
          console.log(err);
          let chatRoomArg = {
            "teacherId": this.teacherProfileId,
            "studentId": this.studentProfileId,
            "userId": this.userId,
            "message": {
              "body": this.newmessage,
              "senderId": this.userProfileId,
              "receiverId": this.receiver.objectId,
              "sentAt": new Date().toISOString()
            }
          }
          this.dataService.getApi("createChatRoom", chatRoomArg).then(API => {
            this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
              console.log(res);
              this.chatMessages.push(res.result)
            })
          })
        })
      })
    } else {
      console.log("direct messaging goes here");
      this.pushMessage(this.chatRoom.roomId);
    }
  }

  pushMessage(roomId) {
    let messageBody = {
      "roomId": roomId,
      "message": this.newmessage,
      "sender": this.userProfileId,
      "receiver": this.receiver.objectId,
      "sentTime": new Date().toISOString()
    }
    this.dataService.getApi('sendMessage', messageBody).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
        console.log(res);
      })
    })
  }

  addmessage() {
    this.dataService.getApi(
      'addChatMessage',
      { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId, message: this.newmessage, viewed: false, role: this.role }
    ).then(async API => {
      return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
        this.content.scrollToBottom();
        this.newmessage = '';
        console.log(response);
        this.getAllMessages();
      }, err => {
        console.log(err);
      })
    });
  }

  scrollto() {
    setTimeout(() => {
      console.log("Scroll to bottom");
      this.content.scrollToBottom();
    }, 1000);
  }

  getAllMessages(skip = null) {
    console.log(this.studentProfileId);
    console.log(this.teacherProfileId);

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllMessages',
        { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId, skip: skip }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          this.chatMessages = [];
          for (let chat of response.result) {
            this.chatMessages.push(chat);
          }

          if (skip) {
            console.log("append chat");
            this.allmessages.concat(this.chatMessages);
            console.log(this.allmessages);
          } else {
            console.log('new message');
            this.allmessages = this.chatMessages;
            console.log(this.allmessages);
          }

        }, err => {
          console.log(err);
        })
      });
    })
  }
}
