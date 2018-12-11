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
  pageNumber = 0;
  messageLimitPerPage: Number = 5;
  roomId : String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, private dataService: DataService) {
    this.params = navParams.get("jobObject");
    this.sender = navParams.get("sender");
    this.receiver = navParams.get("receiver");
    this.navigateFrom = navParams.get("from");
    this.pageNumber = 0;
      
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
      this.roomId = this.teacherProfileId + '|' + this.studentProfileId;
    }else{
      this.chatAccess = true;
      this.chatRoom = navParams.get('chat');
      this.receiver = this.chatRoom.receiver
      this.roomId = this.chatRoom.roomId;
      for (var k = 0; k < this.chatRoom.messages.length; k++) {
        if (k == 0)
          this.chatRoom.messages[k].displayTime = this.getSentTime(this.chatRoom.messages[k].sentAt, this.chatRoom.messages[k].sentAt);
        else
          this.chatRoom.messages[k].displayTime = this.getSentTime(this.chatRoom.messages[k].sentAt, this.chatRoom.messages[k - 1].sentAt);
      }
      this.chatMessages = this.chatRoom.messages.reverse();
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.userId = profile.userData.objectId;
      this.userProfileId = profile.profileData.objectId;
    })
  }


  fetchMore(infiniteScroll) {
    this.pageNumber += 1;
    this.fetchMessages(infiniteScroll);
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
              this.chatMessages.push(res.result);
              this.newmessage = '';
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
        res.result.messages[0] = this.getSentTime(res.result.messages[0].sentAt, new Date().toISOString())
        this.chatMessages.push(res.result.messages[0]);
        this.newmessage = '';
      })
    })
  }

  // addmessage() {
  //   this.dataService.getApi(
  //     'addChatMessage',
  //     { teacherProfileId: this.teacherProfileId, studentProfileId: this.studentProfileId, message: this.newmessage, viewed: false, role: this.role }
  //   ).then(async API => {
  //     return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
  //       this.content.scrollToBottom();
  //       this.newmessage = '';
  //       console.log(response);
  //     }, err => {
  //       console.log(err);
  //     })
  //   });
  // }

  // scrollto() {
  //   setTimeout(() => {
  //     console.log("Scroll to bottom");
  //     this.content.scrollToBottom();
  //   }, 1000);
  // }

  fetchMessages(infiniteScroll) {

    this.dataService.getApi(
      'fetchMessages',
      { roomId: this.roomId, page: this.pageNumber, limit: this.messageLimitPerPage }
    ).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
        console.log(res);
        infiniteScroll.complete();
        if (res.result[0].messages.length > 0) {
          for (var i = 0; i < res.result[0].messages.length; i++) {
            if(i == 0)
            res.result[0].messages[i].displayTime = this.getSentTime(res.result[0].messages[i].sentAt, res.result[0].messages[i].sentAt)
            else
            res.result[0].messages[i].displayTime = this.getSentTime(res.result[0].messages[i].sentAt, res.result[0].messages[i - 1].sentAt)

            this.chatMessages.splice(0, 0, res.result[0].messages[i]);
          }
          if (res.result[0].messages.length < this.messageLimitPerPage) {
            infiniteScroll.enable(false);
            console.log("message finished")
          }
        } else {
          console.log(res)
        }
      }, err => {
        console.log(err);
        infiniteScroll.complete();
      })
    })
  }

  getSentTime(currentIso, previousIso) {
    let sentDate = new Date(currentIso);
    let prevDate = new Date(previousIso);
    let sentTime = sentDate.getHours() + ':' + sentDate.getMinutes();
    let messageDate = null;
    let monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function getMessageDate(){
      console.log(sentDate.getMonth());
      console.log(monthNames)
      return sentDate.getDate() +' '+ monthNames[10] +' '+ sentDate.getFullYear();
    }
    if (prevDate.getDate() < sentDate.getDate()) {
      messageDate = getMessageDate();
    } else if (prevDate.getDate() < sentDate.getDate()) {
      messageDate = getMessageDate();
    } else if (prevDate.getFullYear() < sentDate.getFullYear()) {
      messageDate = getMessageDate();
    } else {
      messageDate = null;
    }
    console.log(messageDate);
    return { sentTime, messageDate };
  }

  
}
