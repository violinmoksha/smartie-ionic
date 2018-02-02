import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AllAcceptedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-notification-feed',
  templateUrl: 'notification-feed.html',
})
export class NotificationFeedPage {
  private allAccepteds: any;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('role').then(role => {
      this.storage.get(role+'UserProfile').then(profile => {
        this.body = { profileId: JSON.parse(profile).profileData.objectId, role: role };

        let API = this.smartieApi.getApi('getAllRequesteds', this.body);

        return new Promise(resolve => {
          interface Response {
            result: any;
          };
          this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
            this.allAccepteds = res.result;
          })
        })
      })
    })
  }

  showJobAccept(accepted){
    var requestingProfileId = accepted.requestingProfile.objectId;
    var requestedProfileId = accepted.requestedProfile.objectId;

    this.body = { requestingProfileId : requestingProfileId, requestedProfileId: requestedProfileId, role: this.navParams.data.activeRole }
    let API = this.smartieApi.getApi('getAcceptedJobRequest', this.body);

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
        // this.navCtrl.push("TeacherJobAccepted", { data: res.result });
        console.log(res.result);
      })
    });

  }
}
