import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the JobRequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-job-request',
  templateUrl: 'job-request.html',
})
export class JobRequestPage {

  private params: any;
  private requestSent: boolean;
  private body: any;
  private submitInProgress: boolean;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public smartieApi: SmartieAPI, private storage: Storage, private loadingCtrl: LoadingController) {
    this.params = navParams.data;
    // console.log(this.params);

    this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Sending...'
    });
  }

  ionViewDidLoad() {
    this.storage.get('role').then(role => {
      this.storage.get(role+"UserProfile").then(roleProfile => {
        if(role === 'teacher'){
          this.body = { requestingProfileId: JSON.parse(roleProfile).profileData.objectId, requestedProfileId: this.params.requestedId };
        }else{
          this.body = { requestingProfileId: this.params.requestedId, requestedProfileId: JSON.parse(roleProfile).profileData.objectId };
        }

        /*return new Promise(resolve => {
          let API = this.smartieApi.getApi(
            'getRequestedJobRequest',
            this.body
          );
          interface Response {};
          this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
            this.loading.dismiss();
            if(Object.keys(response).length > 0){
              this.requestSent = true;
            }else{
              this.requestSent = false;
            }
          }, err => {
            console.log(err);
          })
        })*/
      })
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  sendRequest(){
    this.submitInProgress = true;
    this.loading.present();

    this.storage.get('role').then(role => {
      this.storage.get(role+"UserProfile").then(profile => {
        if (role == 'teacher') {
          this.body = {
            requestingProfileId: this.params.requestedId,
            requestedProfileId: JSON.parse(profile).profileData.objectId,
            jobDescription: this.params.profileAbout,
            prefLocation: this.params.prefLocation,
            requestSent: true,
            acceptedState: false
          };
        } else {
          this.body = {
            requestingProfileId: JSON.parse(profile).profileData.objectId,
            requestedProfileId: this.params.requestedId,
            jobDescription: this.params.profileAbout,
            prefLocation: this.params.prefLocation,
            requestSent: true,
            acceptedState: false
          };
        }

        let API = this.smartieApi.getApi(
          'setJobRequest',
          this.body
        );
        return new Promise(resolve => {
          interface Response {
            result: any
          };
          this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
            this.requestSent = true;
            this.viewCtrl.dismiss();
            this.loading.dismiss();
            this.submitInProgress = false;
          });
        })
      })
    })
  }

  viewProfile(){
    this.navCtrl.push("ViewProfile", this.params);
  }

}
