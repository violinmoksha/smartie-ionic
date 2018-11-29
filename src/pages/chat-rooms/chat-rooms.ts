import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';

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
  public chats: Array<any>;
  public userData: any;
  public userRole: String;
  public userDefaultImg:String = './assets/imgs/user-round-icon.png';
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public dataService: DataService) {
    this.userRole = navParams.get("role");
    console.log(navParams.data);
    this.chats = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomsPage');
    this.loadUserData().then(res => {
      this.fetchChatRooms();
    })
  }

  loadUserData() {
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(user => {
        console.log(user);
        if (user != null) {
          this.userData = user;
          this.userRole = user.profileData.role;
          resolve(user);
        } else {
          reject("no user");
        }
      })
    })
  }

  fetchChatRooms() {
    this.dataService.getApi('fetchChatRoomsById', { profileId: this.userData.profileData.objectId }).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
        console.log(res);
        for (let i=0; i<res.result.length; i++){
          if(res.result[i].receiver.profilePhoto == undefined){
            res.result[i].receiver.profilePhoto = './assets/imgs/user-round-icon.png';
          }
          this.chats.push(res.result[i])
        }
        console.log(this.chats)
      }, err => {
        console.log(err);
      })
    })
  }

  openChat(chat) {
    this.navCtrl.push("ChatPage", {chat:chat})
  }

}
