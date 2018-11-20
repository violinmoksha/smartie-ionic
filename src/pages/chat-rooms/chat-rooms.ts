import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ChatRoomsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-rooms',
  templateUrl: 'chat-rooms.html',
})
export class ChatRoomsPage {
  public chats:Array<any>;
  public userData:any;
  public userRole:String;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage) {
    this.userRole = navParams.get("role");
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomsPage');
    this.chats = [{name:"Test A", profilePic:"./assets/imgs/logo.png"},{name:"Test B", profilePic:"./assets/imgs/logo.png"},{name:"Test C", profilePic:"./assets/imgs/logo.png"}]
    this.loadUserData();
    }

  loadUserData() {
    this.storage.get("UserProfile").then(user => {
      console.log(user);
      if(user != null){
        this.userData = user;
        this.userRole = user.profileData.role;
      }
    })
  }

  openChat() {
    this.navCtrl.push("ChatPage")
  }

}
