import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the JobRequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-job-requests',
  templateUrl: 'job-requests.html',
})
export class JobRequestsPage {

  private params: any;
  private requestSent: boolean;
  private body: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public smartieApi: SmartieAPI, private storage: Storage) {
    this.params = navParams.data;
    //console.log(this.params);
  }

  ionViewDidLoad() {
    this.storage.get('role').then(role => {
      let roleProfile = JSON.parse(localStorage.getItem(role + 'UserProfile'));

      if(role === 'teacher'){
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
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  sendRequest(){
    this.storage.get('role').then(role => {
      if(role === 'teacher'){
        this.body = {
          requestingProfileId: JSON.parse(localStorage.getItem(role+'UserProfile')).profileData.objectId,
          requestedProfileId: this.params.requestedId,
          jobDescription: this.params.profileAbout,
          prefLocation: this.params.prefLocation,
          requestSent: true,
          acceptedState: false
        };
      }else{
        this.body = {
          requestingProfileId: this.params.requestedId,
          requestedProfileId: JSON.parse(localStorage.getItem(role+'UserProfile')).profileData.objectId
        };
      }
      console.log(this.body);
      let API = this.smartieApi.getApi(
        'setJobRequest',
        this.body
      );
      return new Promise(resolve => {
        interface Response {
          result: any
        };
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
          //if(response.status == 200){
            this.requestSent = true;
          //}
          setTimeout(() => {
            this.viewCtrl.dismiss();
          }, 5000);
        });
      })
    });
  }

  viewProfile(){
    this.navCtrl.push("ViewProfile", this.params);
  }

}
