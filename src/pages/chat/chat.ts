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
  newmessage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public chatService: ChatProvider, public events: Events) {
    this.params = navParams.data.params;

    // Initialize chat
    this.chatService.initializebuddy(this.params);

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.senderProfileId = profile.profileData.objectId;
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  addmessage() {
    this.chatService.addnewmessage(this.newmessage, this.senderProfileId).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

}
