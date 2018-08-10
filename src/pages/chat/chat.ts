import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ChatProvider } from '../../providers/chat/chat';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public chatService: ChatProvider, public events: Events) {
    this.params = navParams.data.params;

    // Initialize chat
    this.chatService.initializebuddy(this.params);

    this.storage.get("UserProfile").then(profile => {
      console.log(profile);
      this.role = profile.profileData.role;
      this.senderProfileId = profile.profileData.objectId;
    })

    this.scrollto();
    this.events.subscribe("newmessage", () => {
      this.allmessages = this.chatService.allMessages;
      console.log("Getting all messages here");
      console.log(this.allmessages);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.chatService.getAllMessages(this.senderProfileId);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ChatPage');
  }

  addmessage() {
    this.chatService.addnewmessage(this.newmessage, this.senderProfileId).then((response) => {
      console.log('test');
      this.content.scrollToBottom();
      this.newmessage = '';
      console.log(this.newmessage);
    })
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}

