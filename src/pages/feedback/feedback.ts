import { Response } from './../../providers/data-model/data-model';
import { CameraServiceProvider } from './../../providers/camera-service/camera-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
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
  private userData: any;
  private role: any;
  private feedback: any = '';
  private genericAvatar: any;

  private FeedbackForm: FormGroup;

  public userScreenshotsView: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI, private analytics: AnalyticsProvider, private cameraService: CameraServiceProvider, private dbService: DbserviceProvider) {
    this.analytics.setScreenName("Feedback");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Feedback", "View"));
    //this.profileData = navParams.get("profileData");
    this.dbService.getUser().then((user) => {
      if (user) {
        this.profileData = user.profileData;
        this.userData = user.userData;
      }
    })

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

  // addUserScreenshot(files){
  //   let userScreenshots = new Array();
  //   let userScreenshotsView = new Array();
  //   let requests = files.length;

  //   for(let file of files){
  //     userScreenshotsView.push(file);
  //     this.getBase64(file).then((obj) => {
  //       userScreenshots.push({name: obj['name'], data: obj['data']});
  //       if(--requests == 0) {
  //         this.storage.set('userScreenshots', userScreenshots);
  //       }
  //     });
  //   }
  //   this.userScreenshotsView = userScreenshotsView;
  // }

  // getBase64(file) {
  //   return new Promise(function(resolve, reject){
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = function () {
  //       // var toResolve: object;
  //       let toResolve: any = {};
  //       toResolve.name = file.name;
  //       toResolve.data = this.result;
  //       resolve(toResolve);
  //     };
  //     reader.onerror = function (error) {
  //       //  console.log('Error: ', error);
  //       reject(error);
  //     };
  //   })
  // }

  addUserScreenShot() {
    this.cameraService.getImage().then((files) => {
      console.log(files);
      if (Array.isArray(files)) {
        for (let file of files) {
          this.userScreenshotsView.push({ 'name': this.cameraService.getFileName(), 'data': file });
        }
      } else {
        this.userScreenshotsView.push({ 'name': this.cameraService.getFileName(), 'data': files });
      }
    }, (err) => {
      console.log(err);
    })
  }

  submitFeedback() {
    return new Promise(async (resolve) => {
      let params = { feedback: this.feedback, profileId: this.profileData.objectId, userId: this.userData.objectId, attachment: null };

      if (this.userScreenshotsView.length > 0)
        params.attachment = this.userScreenshotsView;

      let API = await this.smartieApi.getApi(
        'setFeedback',
        params
      );
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(res => {
        console.log(res);
      });
    });
  }

}
