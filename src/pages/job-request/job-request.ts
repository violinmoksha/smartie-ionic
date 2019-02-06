import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { DataService } from '../../app/app.data';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the JobRequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage() @Component({
  selector: 'page-job-request',
  templateUrl: 'job-request.html',
})
export class JobRequestPage {

  private params: any;
  private jobObject: any;
  private teacherObj: any;
  private otherObj: any;
  private requestSent: boolean;
  private acceptState: boolean;
  private body: any;
  private submitInProgress: boolean;
  private loading: any;
  private userRole: any;
  private congrats: boolean;
  private genericAvatar: string;
  private loaded: any = false;
  timeZone: any;
  private appNavCtrl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public dataService: DataService, private storage: Storage, public alertCtrl: AlertController, private loadingCtrl: LoadingController, public app: App, private analytics: AnalyticsProvider) {
    this.analytics.setScreenName("JobRequest");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("JobRequest", "View"));

    this.params = navParams.get('params');
    this.jobObject = Object.assign({}, this.params);
    this.teacherObj = this.params.teacherProfile;
    this.otherObj = this.params.otherProfile;
    this.acceptState = this.jobObject.acceptState;
    // this.jobObject = this.jobObject.role =='teacher' ? (Object.assign({}, ...this.params)this.params.teacherProfile) : this.params.otherProfile;

    this.appNavCtrl = app.getActiveNav();

    if (this.params.role == 'teacher') {
      if(this.jobObject.teacher.defaultStartDateTime.iso && this.jobObject.teacher.defaultEndDateTime.iso){
      // Converting defaultStartDateTime and defaultEndDateTime to current device TimeZone
      let availStartDateTime = new Date(this.jobObject.teacher.defaultStartDateTime.iso);
      let availEndDateTime = new Date(this.jobObject.teacher.defaultEndDateTime.iso);

      this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

      this.jobObject.UTCStartTime = this.formatTime(availStartDateTime);
      this.jobObject.UTCEndTime = this.formatTime(availEndDateTime);

      this.jobObject.UTCstartDate = (availStartDateTime.getMonth() + 1) + '-' + availStartDateTime.getDate() + '-' + availStartDateTime.getFullYear();
      this.jobObject.UTCendDate = (availEndDateTime.getMonth() + 1) + '-' + availEndDateTime.getDate() + '-' + availEndDateTime.getFullYear();

      this.jobObject = Object.assign(this.jobObject, { ...this.teacherObj });
      if(!this.jobObject.jobRequestId && this.params.requestSent){
        this.jobObject.jobRequestId = this.params.objectId;
        this.jobObject.fromWhere = "requestSentJobs";
      }
      }else{
        console.log("No iso time found")
      }
    } else {
      this.jobObject = Object.assign(this.jobObject, { ...this.otherObj });
      if(!this.jobObject.jobRequestId && this.params.requestSent){
        this.jobObject.jobRequestId = this.params.objectId;
        this.jobObject.fromWhere = "requestSentJobs";
      }
    }

    if (this.jobObject.fromWhere && this.jobObject.fromWhere == 'requestSentJobs') {
      this.congrats = true;
    } else {
      this.congrats = false;
    }
    this.submitInProgress = false;
  }

  // This function used to convert Time into US format with AM/PM
  formatTime(dateTime) {
    return dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  loadImage() {
    this.loaded = true;
  }

  ionViewDidLoad() {
    this.storage.get("UserProfile").then(roleProfile => {
      // Flip viewed status to True once enter
      return new Promise(async (resolve) => {
        this.dataService.getApi(
          'jobRequestViewed',
          { jobRequestId: this.jobObject.jobRequestId }
        ).then(async (API) => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async (response) => {
            console.log("Job Request viewed");
            console.log(response);
          }, (err) => {
            console.log(err);
          })
        })
      });

      this.userRole = roleProfile.profileData.role;

      if (this.userRole !== 'teacher' && this.params.fromWhere == 'acceptedJobs') {
        // this.scheduleJob();
        let alert = this.alertCtrl.create({
          title: 'Time to schedule!',
          subTitle: `You must now schedule your session! Tap OK to visit your Schedule page!`,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.push('SchedulePage', {
                params: {
                  jobRequestId: this.jobObject.jobRequestId,
                  profilePhoto: this.jobObject.profilePhoto,
                  profileStripeAccount: this.jobObject.stripeCustomer,
                  fullname: this.jobObject.fullname,
                  teacherProfileId: this.jobObject.teacherProfile.objectId,
                  role: this.jobObject.role,
                  prefPayRate: this.jobObject.prefPayRate,
                  prefLocation: this.jobObject.prefLocation,
                  UTCstartDate: this.jobObject.UTCstartDate,
                  UTCendDate: this.jobObject.UTCendDate,
                  UTCStartTime: this.jobObject.UTCStartTime,
                  UTCEndTime: this.jobObject.UTCEndTime
                }
              })
            }
          }]
        });
        alert.present();
      }

      let otherRole;
      if (this.userRole === 'teacher') {
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.otherObj.objectId };
        otherRole = this.params.role;
      } else {
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.teacherObj.objectId };
        otherRole = 'teacher';
      }

      if (otherRole == 'teacher') {
        this.genericAvatar = './assets/imgs/user-img-teacher.png';
      } else if (otherRole == 'student') {
        this.genericAvatar = './assets/imgs/user-img-student.png';
      } else if (otherRole == 'parent') {
        this.genericAvatar = './assets/imgs/user-img-parent.png';
      } else if (otherRole == 'school') {
        this.genericAvatar = './assets/imgs/user-img-school.png';
      }

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'getRequestedJobRequest',
          this.body
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
            if (response.result && response.result.length > 0) {
              this.requestSent = true;
            } else {
              this.requestSent = false;
            }
          }, err => {
            console.log(err);
          })
        });
      })
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  sendRequest() {
    this.submitInProgress = true;
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.storage.get("UserProfile").then(profile => {
      if (this.userRole == 'teacher' && (profile.profileData.stripeCustomer == undefined || profile.profileData.stripeCustomer == '')) {
        this.checkStripeAccount(profile);
      } else {
        if (profile.profileData.role == 'teacher') {
          this.body = {
            teacherProfileId: profile.profileData.objectId,
            otherProfileId: this.otherObj.objectId,
            jobDescription: this.otherObj.profileAbout,
            prefLocation: this.otherObj.prefLocation,
            requestSent: true,
            acceptState: false,
            paidAndUpcoming: false,
            role: 'teacher'
          };
        } else {
          this.body = {
            teacherProfileId: this.teacherObj.objectId,
            otherProfileId: profile.profileData.objectId,
            jobDescription: this.teacherObj.profileAbout,
            prefLocation: this.teacherObj.prefLocation,
            requestSent: true,
            acceptState: false,
            paidAndUpcoming: false,
            role: profile.profileData.role
          };
        }

        return new Promise(async (resolve) => {
          return await this.dataService.getApi(
            'setJobRequest',
            this.body
          ).then(async API => {
            return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
              this.requestSent = true;
              this.viewCtrl.dismiss();
              this.loading.dismiss();
              this.submitInProgress = false;
            });
          });
        })
      }
    })
  }

  checkStripeAccount(profile) {
    this.loading.dismiss();
    this.viewCtrl.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Time to add your Stripe Account!',
      subTitle: `You must add a Stripe Account in order to receive payments from students! We will send you to Payment Details now in order to gather your information.`,
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.appNavCtrl.parent.select(1);
        }
      }]
    });
    alert.present();
  }

  viewProfile() {
    this.navCtrl.push("ViewProfilePage", { params: this.jobObject });
  }

  accept() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this.storage.get("UserProfile").then(roleProfile => {
      if (this.userRole === 'teacher') {
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.otherObj.objectId, requestSent: true, acceptState: true, paidAndUpcoming: false, role: this.userRole };
      } else {
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.teacherObj.objectId, requestSent: true, acceptState: true, paidAndUpcoming: false, role: this.userRole };
      }

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'setJobRequest',
          this.body
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
            this.acceptState = true;
            this.viewCtrl.dismiss();
            this.loading.dismiss();
            this.submitInProgress = false;
            if (this.userRole !== 'teacher') {
              this.scheduleJob();
            }
          }, err => {
            this.loading.dismiss();
          });
        });
      })

    });
  }

  reject() {
    // requestSent = false & acceptState=false
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this.storage.get("UserProfile").then(roleProfile => {
      if (this.userRole === 'teacher') {
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.otherObj.objectId, requestSent: false, acceptState: false, paidAndUpcoming: false };
      } else {
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.teacherObj.objectId, requestSent: false, acceptState: false, paidAndUpcoming: false };
      }

      return new Promise(async (resolve) => {
        return await this.dataService.getApi(
          'setJobRequest',
          this.body
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
            this.viewCtrl.dismiss();
            this.loading.dismiss();
            this.submitInProgress = false;
          });
        });
      })

    });
  }

  scheduleJob() {
    this.navCtrl.push('SchedulePage', {
      params: {
        profilePhoto: this.teacherObj.profilePhoto,
        fullname: this.teacherObj.fullname,
        teacherProfileId: this.teacherObj.objectId,
        role: this.teacherObj.role,
        prefPayRate: this.teacherObj.prefPayRate,
        prefLocation: this.teacherObj.prefLocation,
        defaultStartDate: this.teacherObj.defaultStartDate,
        defaultEndDate: this.teacherObj.defaultEndDate,
        defaultStartTime: this.teacherObj.defaultStartTime,
        defaultEndTime: this.teacherObj.defaultEndTime,
        profileStripeAccount: this.teacherObj.stripeCustomer,
        jobRequestId: this.jobObject.jobRequestId
      }
    })
  }

  initSendEmail() {
    this.navCtrl.push("SendEmailPage", { params: this.jobObject });
  }

  initChat() {
    let params = {
      jobObject: this.jobObject,
      sender: this.userRole == 'teacher' ? this.teacherObj : this.otherObj,
      receiver: this.userRole == 'teacher' ? this.otherObj : this.teacherObj,
      from: "jobrequest"
    }
    this.navCtrl.push("ChatPage", params);
  }
}
