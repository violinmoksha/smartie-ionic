import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { TeacherJobAccepted } from '../teacher-job-accepted/teacher-job-accepted';

/**
 * Generated class for the AllAcceptedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-all-accepteds',
  templateUrl: 'all-accepteds.html',
})
export class AllAccepteds {
  private allAccepteds: any;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI) {
  }

  ionViewDidLoad() {
    if(this.navParams.data.activeRole == 'teacher'){
      this.body = { requestingProfileId: JSON.parse(localStorage.getItem(this.navParams.data.activeRole+'UserProfile')).profileData.objectId, role: this.navParams.data.activeRole };
    }else{
      this.body = { requestedProfileId: JSON.parse(localStorage.getItem(this.navParams.data.activeRole+'UserProfile')).profileData.objectId };
    }
    let API = this.smartieApi.getApi('getAllAccepteds', this.body);

    return new Promise(resolve => {
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
        this.allAccepteds = res.result;
        console.log(this.allAccepteds);
      })
    })
  }

  showJobAccept(accepted){
    var requestingProfileId = accepted.requestingProfileId;
    var requestedProfileId = accepted.requestedProfileId;

    this.body = { requestingProfileId : requestingProfileId, requestedProfileId: requestedProfileId, role: this.navParams.data.activeRole }
    let API = this.smartieApi.getApi('getAcceptedJobRequest', this.body);

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
        this.navCtrl.push(TeacherJobAccepted, { data: res.result });
      })
    });

  }
}
