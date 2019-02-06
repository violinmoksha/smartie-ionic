import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  smartieList: Array<any> = [];
  userData: any;
  role: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataService: DataService) {
    this.storage.get("UserProfile").then(user => {
      console.log(user);
      this.userData = user;
      this.role = user.profileData.role;
      this.fetchSmartieList(user);
    });
    this.role = navParams.get("role");
    console.log(this.role);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  fetchSmartieList(user) {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'fetchMarkers',
        { profileId: user.profileData.objectId, role: user.profileData.role }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
          return await this.dataService.sanitizeNotifications(Notifications.result).then((notifications: Array<any>) => {
            console.log(notifications);
            if (this.userData.profileData.role == "teacher") {
              for(let k=0; k<notifications.length; k++) {
                this.smartieList.push(notifications[k].otherProfile);
              }
            } else {
              for(let k=0; k<notifications.length; k++) {
                this.smartieList.push(notifications[k].teacherProfile);
              }
            }
            console.log(this.smartieList)
          })
        }, err => {
          console.log(err.error.error);
        });
      });
    });
  }

}
