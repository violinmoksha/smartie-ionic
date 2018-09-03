import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
import { DataService } from '../../app/app.data';

/**
 * Generated class for the AllAcceptedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage() @Component({
  selector: 'page-notification-feed',
  templateUrl: 'notification-feed.html',
})
export class NotificationFeedPage {
  public allAccepteds: Array<{}> = [];
  public allRequesteds: Array<{}> = [];
  public allUpcomings: Array<{}> = [];
  private userRole: any;
  private profileId: any;

  constructor(public navCtrl: NavController, private dataService: DataService, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController, private analytics: AnalyticsProvider) {

    this.analytics.setScreenName("NotificationFeed");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("NotificationFeed", "View"));

    console.log(this.allAccepteds);
    this.loadNotifications();
  }

  ionViewDidLoad() {
    console.log("view loaded");
  }

  loadNotifications() {
    this.storage.get('UserProfile').then(profile => {
      this.profileId = profile.profileData.objectId;
      this.userRole = profile.profileData.role;
      this.fetchAllAcceptedReq(this.profileId, this.userRole);
      this.fetchAllRequested(this.profileId, this.userRole);
      this.fetchAllUpcomingsReq(this.profileId, this.userRole);

      console.log(this.allAccepteds);
      console.log(this.allRequesteds);
      console.log(this.allUpcomings);
    })
  }

  async fetchAllAcceptedReq(profileId, role) {
    return await this.dataService.getApi(
      'getAllAccepteds',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(async jobReq => {
        if (jobReq)
          this.allAccepteds = jobReq[0].data.result; // jobReq[0], jobReq.data[0]???
        console.log(jobReq);
      }, (err) => {
        console.log(err);
      })
    });
  }

  async fetchAllRequested(profileId, role) {
    return await this.dataService.getApi(
      'getAllRequesteds',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(async jobReq => {
        if (jobReq)
          this.allRequesteds = jobReq[0].result; // ???
        console.log(jobReq);
      }, (err) => {
        console.log(err);
      })
    });
  }

  async fetchAllUpcomingsReq(profileId, role) {
    return await this.dataService.getApi(
      'getAllUpcomings',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(async jobReq => {
        if (jobReq)
          this.allUpcomings = jobReq[0].result; // ????

        console.log(jobReq);
      }, (err) => {
        console.log(err);
      })
    });
  }

  toTimeZone(apptDate) {
    let yearMonthDay = apptDate.substr(0, 10);
    let tmpArr = yearMonthDay.split('-');
    return tmpArr[1] + '-' + tmpArr[2] + '-' + tmpArr[0];
  }

  showUpcomingAlert() {
    let alert = this.alertCtrl.create({
      title: 'Remember to Show!',
      subTitle: 'Life is all about showing up, so please show up to your booked session!'
    });
    alert.present();
  }

  showJobRequest(notification, requestState) {
    console.log(notification);
    let navigationParams = Object.assign({}, ...notification);
    console.log("navigate param");
    console.log(navigationParams);
    navigationParams.role = this.userRole != 'teacher' ? notification.teacherProfile.role : notification.otherProfile.role;
    navigationParams.fromWhere = requestState;
    navigationParams.jobRequestId = navigationParams.objectId;
    this.navCtrl.push("JobRequestPage", { params: navigationParams });
    // if(this.userRole != 'teacher'){
    //   this.navCtrl.push("JobRequestPage", { params: {
    //       jobRequestId: notification.objectId,
    //       profilePhoto: notification.teacherProfile.profilePhoto,
    //       profileStripeAccount: notification.teacherProfile.stripeCustomer,
    //       fullname: notification.teacherProfile.fullname,
    //       role: notification.teacherProfile.role,
    //       profileTitle: notification.teacherProfile.profileTitle,
    //       profileAbout: notification.teacherProfile.profileAbout,
    //       prefLocation: notification.teacherProfile.prefLocation,
    //       teacherProfileId: notification.teacherProfile.objectId,
    //       otherProfileId: notification.otherProfile.objectId,
    //       prefPayRate: notification.teacherProfile.prefPayRate,
    //       // defaultStartDate: notification.teacher.defaultStartDate,
    //       // defaultEndDate: notification.teacher.defaultEndDate,
    //       // defaultStartTime: notification.teacher.defaultStartTime,
    //       // defaultEndTime: notification.teacher.defaultEndTime,
    //       fromWhere: requestState,
    //       defaultStartDateTime: notification.teacher.defaultStartDateTime,
    //       defaultEndDateTime: notification.teacher.defaultEndDateTime,
    //     }
    //   })
    // }else{
    //   this.navCtrl.push("JobRequestPage", { params: {
    //       jobRequestId: notification.objectId,
    //       profilePhoto: notification.otherProfile.profilePhoto,
    //       profileStripeAccount: notification.otherProfile.stripeCustomer,
    //       fullname: notification.otherProfile.fullname,
    //       role: notification.otherProfile.role,
    //       profileTitle: notification.otherProfile.profileTitle,
    //       profileAbout: notification.otherProfile.profileAbout,
    //       prefLocation: notification.otherProfile.prefLocation,
    //       teacherProfileId: notification.teacherProfile.objectId,
    //       otherProfileId: notification.otherProfile.objectId,
    //       prefPayRate: notification.teacherProfile.prefPayRate,
    //       // defaultStartDate: notification.teacher.defaultStartDate,
    //       // defaultEndDate: notification.teacher.defaultEndDate,
    //       // defaultStartTime: notification.teacher.defaultStartTime,
    //       // defaultEndTime: notification.teacher.defaultEndTime,
    //       fromWhere: requestState,
    //       defaultStartDateTime: notification.teacher.defaultStartDateTime,
    //       defaultEndDateTime: notification.teacher.defaultEndDateTime,
    //     }
    //   })
    // }
  }
}
