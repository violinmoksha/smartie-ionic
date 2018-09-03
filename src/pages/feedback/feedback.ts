import { CameraServiceProvider } from '../../providers/camera-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DataService } from '../../app/app.data';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics';
import { FileUploaderProvider } from '../../providers/file-uploader';

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
  public feedback: any;
  public feedbackValue: any;
  public loading: any;

  public FeedbackForm: FormGroup;

  public userScreenshotsView: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public dataService: DataService, private analytics: AnalyticsProvider, private cameraService: CameraServiceProvider, private fileUploader: FileUploaderProvider, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.analytics.setScreenName("Feedback");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Feedback", "View"));
    //this.profileData = navParams.get("profileData");
    this.storage.get('UserProfile').then(user => {
      if (user) {
        this.profileData = user.profileData;
        this.userData = user.userData;
      } else {
        // TODO: alertCtrl, we resolve(false)'d
      }
    }, error => {
      // TODO: alertCtrl, we reject(error)'d
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
      if (Array.isArray(files)) {
        for (var i=0; i<files.length; i++) {
          this.userScreenshotsView.push({ 'displayName':"file"+this.userScreenshotsView.length,'name': await this.cameraService.getFileName(), 'data': files[i] });
        }
      }
      /***testing file transfer */

      // this.fileUploader.uploadFileToAWS(files[0]);
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
      let params = { feedBack: this.feedbackValue, profileId: this.profileData.objectId, userId: this.userData.objectId, attachment: null, userName:this.profileData.fullname, email: this.userData.email };

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
    });


  }

  async setFeedbackApi(params) {
    return await this.dataService.getApi(
      'setFeedback',
      params
    ).then(async API => {
      return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(async res => {
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
        return res;
      }, err => {
        this.loading.dismiss();
        return err;
      });
    });
  }

}
