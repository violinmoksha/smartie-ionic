import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { ContactPatterns } from '../../providers/contact-patterns'

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
  public userDefaultImg: String = './assets/imgs/user-round-icon.png';
  public chatLoader: Boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public dataService: DataService, public contactPattern: ContactPatterns) {
    this.userRole = navParams.get("role");
    this.chats = [];
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChatRoomsPage');
  }

  ionViewDidEnter() {
    this.dataService.currentPage = "ChatRoomsPage"
    this.loadUserData().then(res => {
      this.fetchChatRooms();
    })
  }

  loadUserData() {
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(user => {
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
    this.chatLoader = true;
    this.chats = [];
    this.dataService.getApi('fetchChatRoomsById', { profileId: this.userData.profileData.objectId }).then(API => {
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
        for (let i = 0; i < res.result.length; i++) {
          if (res.result[i].receiver.profilePhoto == undefined) {
            res.result[i].receiver.profilePhoto = './assets/imgs/user-round-icon.png';
          }
          this.fetchMessages(res.result[i].roomId).then(messages => {
            res.result[i].messages = messages[0].messages;
            this.contactPattern.allowedInput(res.result[i].messages[0].message).then(isAllowed => {
              if(!isAllowed){
                res.result[i].messages[0].sourceMessage = res.result[i].messages[0].message;
                res.result[i].messages[0].message = "*** Content blocked by smartie ***";
              }
              this.chats.push(res.result[i]);
            })
            this.chatLoader = false;
          }, err => {
            res.result[i].messages = [];
            this.chats.push(res.result[i]);
            this.chatLoader = false;
          })
        }
      }, err => {
        console.log(err);
        this.chatLoader = false;
      })
    })
  }

  fetchMessages(roomId) {
    return new Promise((resolve, reject) => {
      let params = {
        "roomId": roomId,
        "page": 0,
        "limit": 5
      }
      this.dataService.getApi('fetchMessages', params).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(res => {
          resolve(res.result);
        }, err => {
          reject(err);
        })
      })
    })
  }

  openChat(chat) {
    this.navCtrl.push("ChatPage", { chat: chat })
  }

}
