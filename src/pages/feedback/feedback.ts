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

    this.storage.get('UserProfile').then(user => {
      if (user) {
        this.profileData = user.profileData;
        this.userData = user.userData;
      }
    }, error => {
      // TODO: alertCtrl, we reject(error)'d
      console.log(error);
    })

    this.FeedbackForm = new FormGroup({
      userScreenshot: new FormControl(''),
      feedback: new FormControl('', Validators.required)
    });

    this.loading = this.loadingCtrl.create({
      content: 'Updating....'
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FeedbackPage');
  }

  addUserScreenShot() {
    this.cameraService.getImage().then(async (files) => {
      if (Array.isArray(files)) {
        for (let file of files) {
          this.userScreenshotsView.push({ 'name': await this.cameraService.getFileName(), 'data': file });
        }
      } else {
        this.userScreenshotsView.push({ 'name': await this.cameraService.getFileName(), 'data': files });
      }
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
      let params = { feedBack: this.feedbackValue, profileId: this.profileData.objectId, userId: this.userData.objectId, attachment: null, userName: this.profileData.fullname, email: this.userData.email };

      if (this.userScreenshotsView.length > 0) {
        /*for (let i = 0; i < this.userScreenshotsView.length; i++) {
          filePromises.push(this.fileUploader.uploadFile(this.userScreenshotsView[i], 'png'));
        }*/
        /** To S3 bucket */
        this.uploadToFirebaseBucket(this.userScreenshotsView).then(res => {
          params.attachment = res;
          this.setFeedbackApi(params);
        })
      } else {
        this.setFeedbackApi(params);
      }
    });
  }

  uploadToFirebaseBucket(files) {
    return new Promise((resolve, reject) => {
      let filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(this.fileUploader.uploadToFCS(files[i].data.imageUrl, 'FeedBack'));
      }
      Promise.all(filePromises).then((results) => {
        resolve(results);
      })
    })
  }

  async setFeedbackApi(params) {
    return await this.dataService.getApi(
      'setFeedback',
      params
    ).then(async API => {
      return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async res => {
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
