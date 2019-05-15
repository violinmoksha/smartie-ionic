import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils';
/**
 * Generated class for the MyprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyprofilePage {
  public user:any = {};
  public timeZone:any;
  public role:any;
  public prevLevel:any = null;
  public nextLevel:any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public utils: UtilsProvider) {
  }

  ionViewDidEnter() {
    this.storage.get("UserProfile").then(userData => {
      console.log(userData);
      if(userData && userData.profileData){
        this.user = userData.profileData;
        this.user.profilePhoto = userData.profileData.profilePhoto ? userData.profileData.profilePhoto : '../assets/imgs/user-round-icon.png'
        this.role = userData.profileData.role;
        let levels:any = this.utils.getProfLevelByActive(userData.profileData.badgeName, this.role);
        console.log(levels)
        this.nextLevel = levels.next;
        this.prevLevel = levels.prev;

        }
        if(userData && userData.specificUser){
          this.user.specificUser = userData.specificUser;
          this.user.specificUser.UTCStartTime = this.getTimeString(userData.specificUser.defaultStartDateTime.iso);
          this.user.specificUser.UTCEndTime = this.getTimeString(userData.specificUser.defaultEndDateTime.iso);
          this.user.specificUser.UTCstartDate = new Date(userData.specificUser.defaultStartDateTime.iso).toLocaleDateString();
          this.user.specificUser.UTCendDate = new Date(userData.specificUser.defaultEndDateTime.iso).toLocaleDateString();
      }
      this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    })
  }

  getTimeString(date) {
    var dt = new Date(date);
    var time = dt.toLocaleTimeString();
    time = time.replace(/\u200E/g, '');
    time = time.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
    return time;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyprofilePage');
  }

  gotoEdit() {
      this.navCtrl.push("EditProfilePage");
  }

}
