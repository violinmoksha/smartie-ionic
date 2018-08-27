import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ChatProvider } from '../../providers/chat';

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
  private role: any;
  private senderProfileId: any;
  private newmessage: any;
  private allmessages: any;
  private photoURL: string = './assets/imgs/user-img-teacher.png';
  public chatAccess: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public chatService: ChatProvider, public events: Events) {
    this.params = navParams.get("params");
    console.log(this.params);

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

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.senderProfileId = profile.profileData.objectId;
    })

    this.scrollto();
    this.events.subscribe("newmessage", () => {
      this.allmessages = this.chatService.allMessages;
      console.log("Get all message here");
      console.log(this.allmessages);
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ChatPage');
    console.log(this.chatAccess);
    this.chatService.getAllMessages();
  }

  addmessage() {
    this.chatService.addnewmessage(this.newmessage).then((response) => {
      console.log('test');
      this.content.scrollToBottom();
      this.newmessage = '';
      console.log(response);
      this.chatService.getAllMessages();
    })
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}

