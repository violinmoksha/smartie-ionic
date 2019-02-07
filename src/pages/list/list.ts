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
  smartieListAlias:any;
  userData: any;
  role: any;
  cityName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataService: DataService) {
    this.storage.get("UserProfile").then(user => {
      console.log(user);
      this.userData = user;
      this.role = user.profileData.role;
      this.cityName = user.profileData.cityName;
      this.fetchSmartieList(user);
    });
    this.role = navParams.get("role");
    console.log(this.role);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  filterBysubject(e) {
    this.smartieListAlias = this.smartieList;
    var searchValue = e.target.value;
    this.smartieListAlias = this.smartieListAlias.filter(subject => {
       return (subject.profileTitle.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || subject.profileAbout.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
    })
  }

  // submitSearch(e) {
  //   console.log("submit search");
  //   console.log(e);
  // }

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
            console.log(this.smartieList);
            this.smartieListAlias = this.smartieList;
          })
        }, err => {
          console.log(err.error.error);
        });
      });
    });
  }

}
