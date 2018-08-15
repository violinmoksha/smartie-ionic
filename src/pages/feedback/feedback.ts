import { Response } from './../../providers/data-model/data-model';
import { CameraServiceProvider } from './../../providers/camera-service/camera-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn, } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FileUploaderProvider } from '../../providers/file-uploader/file-uploader';

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
  public feedback: any;
  public feedbackValue: any;
  private genericAvatar: any;
  public loading: any;

  public FeedbackForm: FormGroup;

  public userScreenshotsView: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public smartieApi: SmartieAPI, private analytics: AnalyticsProvider, private cameraService: CameraServiceProvider, private dbService: DbserviceProvider, private fileUploader: FileUploaderProvider, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
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

    this.loading = this.loadingCtrl.create({
      content: 'Updating....'
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  addUserScreenShot() {
    this.cameraService.getImage().then(async (files) => {
      console.log('images from action');
      console.log(files);
      if (Array.isArray(files)) {
        for (var i=0; i<files.length; i++) {
          this.userScreenshotsView.push({ 'displayName':"file"+this.userScreenshotsView.length,'name': await this.cameraService.getFileName(), 'data': files[i] });
        }
      }
      //  else {
      //   this.userScreenshotsView.push({ 'name': this.cameraService.getFileName(), 'data': files });
      // }
    }, (err) => {
      console.log(err);
    })
  }

  removeFile(i) {
    this.userScreenshotsView.splice(i, 1);
  }

  submitFeedback() {
    return new Promise((resolve) => {
      this.loading.present();
      let params = { feedBack: this.feedbackValue, profileId: this.profileData.objectId, userId: this.userData.objectId, attachment: null };

      if (this.userScreenshotsView.length > 0) {
        let filePromises = [];
        for (let i = 0; i < this.userScreenshotsView.length; i++) {
          filePromises.push(this.fileUploader.uploadFile(this.userScreenshotsView[i], 'png'));
        }
        Promise.all(filePromises).then((results) => {
          console.log(results);
          params.attachment = results;
          this.setFeedbackApi(params);
        })
      } else {
        this.setFeedbackApi(params);
      }
    })
  }

  async setFeedbackApi(params) {
    let API = await this.smartieApi.getApi(
      'setFeedback',
      params
    );
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(res => {
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Thanks!',
        subTitle: `Successfully submitted your feedback.`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
    }, err => {
      this.loading.dismiss();
    });
  }

}
