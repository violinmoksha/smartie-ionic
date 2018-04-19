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
  private newMessage: any;
  private allMessages: any;
  private photoURL: string = './assets/imgs/user-img-teacher.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public chatService: ChatProvider, public events: Events) {
    this.params = navParams.data.params;

    // Initialize chat
    this.chatService.initializeBuddy(this.params);

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.senderProfileId = profile.profileData.objectId;
    })

    this.scrollto();
    this.events.subscribe("newMessage", () => {
      this.allMessages = this.chatService.allMessages;
      console.log(this.allMessages);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter() {
    this.chatService.getAllMessages(this.senderProfileId);
  }

  addMessage() {
    this.chatService.addNewMessage(this.newMessage, this.senderProfileId).then((response) => {
      console.log('test');
      this.content.scrollToBottom();
      this.newMessage = '';
      console.log(this.newMessage);
    })
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}
