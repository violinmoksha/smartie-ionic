import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

/**
 * Generated class for the SetReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  private profileData: any;
  private role: any;
  private feedback: any = '';
  private genericAvatar: any;

  private FeedbackForm : FormGroup;

  public userScreenshotsView: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI, private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("Feedback");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Feedback", "View"));
    this.profileData = navParams.get("profileData");

    /*if (this.profileData.role == 'teacher') {
      this.genericAvatar = '/assets/imgs/user-img-teacher.png';
    } else if (this.profileData.role == 'student') {
      this.genericAvatar = '/assets/imgs/user-img-student.png';
    } else if (this.profileData.role == 'parent') {
      this.genericAvatar = '/assets/imgs/user-img-parent.png';
    } else if (this.profileData.role == 'school') {
      this.genericAvatar = '/assets/imgs/user-img-school.png';
    }

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    })*/

    this.FeedbackForm = new FormGroup({
      userScreenshot: new FormControl(''),
      feedback: new FormControl('', Validators.required)
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  addUserScreenshot(files){
    let userScreenshots = new Array();
    let userScreenshotsView = new Array();
    let requests = files.length;

    for(let file of files){
      userScreenshotsView.push(file);
      this.getBase64(file).then((obj) => {
        userScreenshots.push({name: obj['name'], data: obj['data']});
        if(--requests == 0) {
          this.storage.set('userScreenshots', userScreenshots);
        }
      });
    }
    this.userScreenshotsView = userScreenshotsView;
  }

  getBase64(file) {
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        // var toResolve: object;
        let toResolve: any = {};
        toResolve.name = file.name;
        toResolve.data = this.result;
        resolve(toResolve);
      };
      reader.onerror = function (error) {
        //  console.log('Error: ', error);
        reject(error);
      };
    })
  }

  submitFeedback(){
    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'setFeedback',
        { feedback: this.feedback, profileId: this.profileData.objectId }
      );
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {

      });
    });
  }

}
