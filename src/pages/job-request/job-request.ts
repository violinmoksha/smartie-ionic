import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
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
  private genericAvatar: string;
  private loaded: any = false;
  timeZone: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public smartieApi: SmartieAPI, private storage: Storage, public alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.params = navParams.get('params');
    console.log(this.params);

    if(this.params.role == 'teacher'){
      // Converting defaultStartDateTime and defaultEndDateTime to current device TimeZone
      var availStartDateTime = new Date(this.params.defaultStartDateTime.iso);
      var availEndDateTime = new Date(this.params.defaultEndDateTime.iso);

      this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

      this.params.UTCStartTime = this.formatTime(availStartDateTime);
      this.params.UTCEndTime = this.formatTime(availEndDateTime);

      this.params.UTCstartDate = (availStartDateTime.getMonth()+1) + '-' + availStartDateTime.getDate() + '-' + availStartDateTime.getFullYear();
      this.params.UTCendDate = (availEndDateTime.getMonth()+1) + '-' + availEndDateTime.getDate() + '-' + availEndDateTime.getFullYear();
    }

    if (this.params.fromWhere && this.params.fromWhere == 'requestSentJobs') {
      this.congrats = true;
    } else {
      this.congrats = false;
    }
    this.submitInProgress = false;
  }

  // This function used to convert Time into US format with AM/PM
  formatTime(dateTime){
    return dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  loadImage(){
    this.loaded = true;
  }

  ionViewDidLoad() {
    this.storage.get("UserProfile").then(roleProfile => {
      this.userRole = roleProfile.profileData.role;

      if(this.userRole !== 'teacher' && this.params.fromWhere == 'acceptedJobs'){
        // this.scheduleJob();
        console.log(this.params);
        let alert = this.alertCtrl.create({
          title: 'Time to schedule!',
          subTitle: `You must now schedule your session! Tap OK to visit your Schedule page!`,
          buttons: [{
            text: 'OK',
            handler: () => {
              // this.navCtrl.push('NotificationFeedPage');
              this.navCtrl.push('SchedulePage', { params: {
                jobRequestId: this.params.jobRequestId,
                profilePhoto: this.params.profilePhoto,
                profileStripeAccount: this.params.profileStripeAccount,
                fullname: this.params.fullname,
                teacherProfileId: this.params.teacherProfileId,
                role: this.params.role,
                prefPayRate: this.params.prefPayRate,
                prefLocation: this.params.prefLocation,
                UTCstartDate: this.params.UTCstartDate,
                UTCendDate: this.params.UTCendDate,
                UTCStartTime: this.params.UTCStartTime,
                UTCEndTime: this.params.UTCEndTime
              }})
            }
          }]
        });
        alert.present();
      }

      let otherRole;
      if(this.userRole === 'teacher'){
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.params.otherProfileId };
        otherRole = this.params.role;
      }else{
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.params.teacherProfileId };
        otherRole = 'teacher';
      }

      if (otherRole == 'teacher') {
        this.genericAvatar = '/assets/imgs/user-img-teacher.png';
      } else if (otherRole == 'student') {
        this.genericAvatar = '/assets/imgs/user-img-student.png';
      } else if (otherRole == 'parent') {
        this.genericAvatar = '/assets/imgs/user-img-parent.png';
      } else if (otherRole == 'school') {
        this.genericAvatar = '/assets/imgs/user-img-school.png';
      }

      return new Promise(async (resolve) => {
        let API = await this.smartieApi.getApi(
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
    this.submitInProgress = true;
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();

    this.storage.get("UserProfile").then(profile => {
      if(this.userRole == 'teacher' && (profile.profileData.stripeCustomer == undefined || profile.profileData.stripeCustomer == '' )) {
        this.checkStripeAccount(profile);
      }else{
        if (profile.profileData.role == 'teacher') {
          this.body = {
            teacherProfileId: profile.profileData.objectId,
            otherProfileId: this.params.otherProfileId,
            jobDescription: this.params.profileAbout,
            prefLocation: this.params.prefLocation,
            requestSent: true,
            acceptState: false,
            paidAndUpcoming: false,
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
            paidAndUpcoming: false,
            role: profile.profileData.role
          };
        }
  
        return new Promise(async (resolve) => {
          let API = await this.smartieApi.getApi(
            'setJobRequest',
            this.body
          );
        
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
      }
    })
  }

  checkStripeAccount(profile){
    let alert = this.alertCtrl.create({
      title: 'Time to add your Stripe Account!',
      subTitle: `You must add a Stripe Account in order to receive payments from students! We will send you to Payment Details now in order to gather your information.`,
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.push("TabsPage", { tabIndex: 1, tabTitle: 'PaymentDetailsPage', role: this.params.role });
          // this.navCtrl.parent.select(1);
        }
      }]
    });
    alert.present();
}

  viewProfile(){
    console.log(this.params);
    this.navCtrl.push("ViewProfilePage", { params: this.params });
  }

  accept(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this.storage.get("UserProfile").then(roleProfile => {
      if(this.userRole === 'teacher'){
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.params.otherProfileId, requestSent: true, acceptState: true, paidAndUpcoming: false, role: this.userRole };
      }else{
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.params.teacherProfileId, requestSent: true, acceptState: true, paidAndUpcoming: false, role: this.userRole };
      }

      console.log('sending '+JSON.stringify(this.body));

      return new Promise(async (resolve) => {
        let API = await this.smartieApi.getApi(
          'setJobRequest',
          this.body
        );
      
        interface Response {
          result: any
        };
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
          this.acceptState = true;
          this.viewCtrl.dismiss();
          this.loading.dismiss();
          this.submitInProgress = false;

          if (this.userRole !== 'teacher') {
            this.scheduleJob();
          }
        });
      })

    });
  }

  reject(){
    // requestSent = false & acceptState=false
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this.storage.get("UserProfile").then(roleProfile => {
      if(this.userRole === 'teacher'){
        this.body = { teacherProfileId: roleProfile.profileData.objectId, otherProfileId: this.params.otherProfileId, requestSent: false, acceptState: false, paidAndUpcoming: false };
      }else{
        this.body = { otherProfileId: roleProfile.profileData.objectId, teacherProfileId: this.params.teacherProfileId, requestSent: false, acceptState: false, paidAndUpcoming: false };
      }

      return new Promise(async (resolve) => {
        let API = await this.smartieApi.getApi(
          'setJobRequest',
          this.body
        );

        interface Response {
          result: any
        };
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
          this.viewCtrl.dismiss();
          this.loading.dismiss();
          this.submitInProgress = false;
        });
      })

    });
  }

  scheduleJob(){
    this.navCtrl.push('SchedulePage', { params: {
      profilePhoto: this.params.profilePhoto,
      fullname: this.params.fullname,
      teacherProfileId: this.params.teacherProfileId,
      role: this.params.role,
      prefPayRate: this.params.prefPayRate,
      prefLocation: this.params.prefLocation,
      defaultStartDate: this.params.defaultStartDate,
      defaultEndDate: this.params.defaultEndDate,
      defaultStartTime: this.params.defaultStartTime,
      defaultEndTime: this.params.defaultEndTime,
      profileStripeAccount: this.params.profileStripeAccount,
      jobRequestId: this.params.jobRequestId
    }})
  }

  initSendEmail(){
    this.navCtrl.push("SendEmailPage", { params: this.params });
  }
}
