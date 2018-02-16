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
  private acceptState: boolean;
  private body: any;
  private submitInProgress: boolean;
  private loading: any;
  private userRole: any;
  private congrats: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public smartieApi: SmartieAPI, private storage: Storage, private loadingCtrl: LoadingController) {
    this.params = navParams.data.params;
    if (this.params.fromWhere && this.params.fromWhere == 'requestSentJobs') {
      this.congrats = true;
    } else {
      this.congrats = false;
    }
    this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
  }

  ionViewDidLoad() {
    this.storage.get("UserProfile").then(roleProfile => {
      this.userRole = roleProfile.profileData.role;
      if(this.userRole === 'teacher'){
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.params.otherProfileId };
      }else{
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.params.teacherProfileId };
      }

      return new Promise(resolve => {
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
      })
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  sendRequest(){
    this.submitInProgress = true;
    this.loading.present();

    this.storage.get("UserProfile").then(profile => {
      if (profile.profileData.role == 'teacher') {
        this.body = {
          teacherProfileId: profile.profileData.objectId,
          otherProfileId: this.params.otherProfileId,
          jobDescription: this.params.profileAbout,
          prefLocation: this.params.prefLocation,
          requestSent: true,
          acceptState: false,
          role: 'teacher'
        };
      } else {
        this.body = {
          teacherProfileId: this.params.teacherProfileId,
          otherProfileId: profile.profileData.objectId,
          jobDescription: this.params.profileAbout,
          prefLocation: this.params.prefLocation,
          requestSent: true,
          acceptState: false,
          role: profile.profileData.role
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
  }

  viewProfile(){
    this.navCtrl.push("ViewProfile", this.params);
  }

  accept(){
    this.loading.present();
    this.storage.get("UserProfile").then(roleProfile => {
      if(this.userRole === 'teacher'){
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.params.otherProfileId, requestSent: true, acceptState: true };
      }else{
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.params.teacherProfileId, requestSent: true, acceptState: true };
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
          this.acceptState = true;
          this.viewCtrl.dismiss();
          this.loading.dismiss();
          this.submitInProgress = false;
        });
      })

    });
  }

  reject(){

  }
}
