import { FileTransfer } from '@ionic-native/file-transfer';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { ContactPatterns } from '../../providers/contact-patterns';

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
  chatRoom:any = {};
  userProfileId:String;
  pageNumber = 0;
  messageLimitPerPage: Number = 5;
  roomId : String;
  notification: any;
  notificationData: any;
  loadingChats: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, private dataService: DataService, private changeRef: ChangeDetectorRef, public contactPattern: ContactPatterns) {
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
    } else if(this.navigateFrom == "toaster") {
      this.chatAccess = true;
      this.notification = navParams.get("notification");
      this.notificationData = JSON.parse(this.notification.extraData);
      this.roomId = this.notificationData.roomId;
      this.chatRoom = Object.assign({}, ...this.chatRoom, {"roomId":this.roomId});
      console.log(this.chatRoom);
      this.loadingChats = true;
      this.dataService.getApi(
        'getProfileById',
        { profileId: this.notificationData.sender }
      ).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
          console.log(res);
          if (res.result.profilePhoto == undefined) {
            res.result.profilePhoto = './assets/imgs/user-round-icon.png';
          }
          this.receiver = res.result;
          this.chatRoom['receiver'] = this.receiver;
          this.loadingChats = false;
          this.fetchMessages();
        }, err => {
          this.loadingChats = false;
          console.log(err);
        })
      })
    } else {
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
    this.dataService.currentPage = "ChatPage"
    this.events.subscribe("pullMessage", (notification) => {
      console.log("pulling message");
      console.log(notification);
      let message = JSON.parse(notification.extraData);
      if(message.messageId.includes(this.roomId)){
        console.log("current Room"+this.roomId+'-'+message.messageId);
        message.displayTime = this.getSentTime(message.sentAt, new Date().toISOString());
        this.chatMessages.push(message);
        this.changeRef.detectChanges();
        try{
          this.content.scrollToBottom();
        }catch(e){
          console.log(e);
        }
      } else {
        console.log("wrong window");
      }
    })
  }

  ionViewWillLeave() {
    this.dataService.currentPage = "Root"
  }

  sendMessage() {
    if (this.navigateFrom == 'jobrequest') {
      this.dataService.getApi('getMyChatRoom', { roomId: this.teacherProfileId + '|' + this.studentProfileId }).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
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
              let message = res.result.messages.messages[0];
              message.displayTime = this.getSentTime(message.sentAt, new Date().toISOString());
              this.chatMessages.push(message);
              this.newmessage = '';
              this.content.scrollToBottom();
            })
          })
        })
      })
    } else {
      this.pushMessage(this.chatRoom.roomId);
    }
  }

  pushMessage(roomId) {
    if(this.contactPattern.allowedInput(this.newmessage)) {
      this.newmessage = "********";
    }
    let messageBody = {
      "roomId": roomId,
      "message": this.newmessage,
      "sender": this.userProfileId,
      "receiver": this.receiver.objectId,
      "sentTime": new Date().toISOString()
    }
    this.dataService.getApi('sendMessage', messageBody).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
        res.result.messages[0].displayTime = this.getSentTime(res.result.messages[0].sentAt, new Date().toISOString())
        this.chatMessages.push(res.result.messages[0]);
        this.newmessage = '';
        this.content.scrollToBottom();
      })
    })
  }

  fetchMessages(infiniteScroll = null) { //NB: to reuse this function added infinitescroll as optional param
    this.dataService.getApi(
      'fetchMessages',
      { roomId: this.roomId, page: this.pageNumber, limit: this.messageLimitPerPage }
    ).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {

        if(infiniteScroll)
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
            if(infiniteScroll)
            infiniteScroll.enable(false);
          }
        } else {
          console.log(res)
        }
      }, err => {
        console.log(err);
        if(infiniteScroll)
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
    return { "sentTime":sentTime, "messageDate":messageDate };
  }


}
