import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the JobRequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-job-requests',
  templateUrl: 'job-requests.html',
})
export class JobRequests {

  private params: any;
  private requestSent: boolean;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public smartieApi: SmartieAPI) {
    this.params = navParams.data;
    console.log(this.params);
  }

  ionViewDidLoad() {
    let roleProfile = JSON.parse(localStorage.getItem(this.params.loggedRole + 'UserProfile'));

    if(this.params.loggedRole === 'teacher'){
      this.body = { requestingProfileId: roleProfile.profileData.objectId, requestedProfileId: this.params.requestedId };
    }else{
      this.body = { requestingProfileId: this.params.requestedId, requestedProfileId: roleProfile.profileData.objectId };
    }

    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getRequestedJobRequest',
        this.body
      );
      interface Response {};
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {

        if(Object.keys(response).length > 0){
          this.requestSent = true;
        }else{
          this.requestSent = false;
        }
      }, err => {
        console.log(err);
      })
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  sendRequest(){

    if(this.params.loggedRole === 'teacher'){
      this.body = { requestingProfileId: JSON.parse(localStorage.getItem(this.params.loggedRole+'UserProfile')).profileData.objectId, requestedProfileId: this.params.requestedId  };
    }else{
      this.body = { requestingProfileId: this.params.requestedId, requestedProfileId: JSON.parse(localStorage.getItem(this.params.loggedRole+'UserProfile')).profileData.objectId  }
    }
    let API = this.smartieApi.getApi(
      'setJobRequest',
      this.body
    );
    return new Promise(resolve => {
      interface Response {
        status: number
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        if(response.status == 200){
          this.requestSent = true;
        }
        setTimeout(() => {
          this.viewCtrl.dismiss();
        }, 5000);
      })
    })

  }

}
