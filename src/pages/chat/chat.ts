import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ChatProvider } from '../../providers/chat';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public chatService: ChatProvider, public events: Events, private dataService: DataService) {
    this.params = navParams.get("params");

    if(!this.params.teacherProfile.stripeCustomer || this.params.teacherProfile.stripeCustomer == 'undefined'){
      this.chatAccess = false;
    }
    /* if(this.params.role == 'teacher'){
      console.log("Teacher");
      if(!this.params.teacherProfile.stripeCustomer || this.params.teacherProfile.stripeCustomer == 'undefined'){
        this.chatAccess = false;
      }
    }else{
      console.log("Student");
      console.log(this.params.teacherProfile);
      if(!this.params.teacherProfile.stripeCustomer || this.params.teacherProfile.stripeCustomer == 'undefined'){
        console.log("Debug ok");
        this.chatAccess = false;
      }
    } */
    // Initialize chat
    this.chatService.initializebuddy(this.params);
    if(this.params.role != 'teacher'){
      this.studentProfileId = this.params.objectId;
      this.teacherProfileId = this.params.teacherProfile.objectId;
    }else{
      this.teacherProfileId = this.params.objectId;
      this.studentProfileId = this.params.otherProfile.objectId;
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    })

    this.scrollto();

    /* this.events.subscribe("newMessage", (messages) => {
      console.log(messages);
      console.log("Test subscribe");
      this.allmessages = messages;
      // this.allmessages.reverse();
    })

    this.events.subscribe("loadOldMessage", (messages) => {
      console.log("loadOldMessage");
      let oldMessages = messages;
      // oldMessages.reverse();
      // this.allmessages.reverse();
      console.log(oldMessages);
      if(oldMessages.length > 0 ){
        this.allmessages.push(...oldMessages);
        // this.allmessages = this.allmessages.concat(oldMessages);
        console.log(this.allmessages);
      }
    }) */

  }

  onScroll(scrollEvent){
    if(scrollEvent.scrollTop == 0){
      console.log(this.allmessages.length);
      console.log("Almost reach top");
      this.getAllMessages(this.allmessages.length);
    }
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    console.log(this.chatAccess);
    this.getAllMessages();
  }

  addmessage() {
    this.chatService.addnewmessage(this.newmessage).then((response) => {
      console.log('test');
      this.content.scrollToBottom();
      this.newmessage = '';
      console.log(response);
      this.getAllMessages();
    })
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
        return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders ).then(async response => {
          this.chatMessages = [];
          for(let chat of response.data.result){
            this.chatMessages.push(chat);
          }

          if(skip){
            console.log("append chat");
            this.allmessages.concat(this.chatMessages);
            console.log(this.allmessages);
          }else{
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
