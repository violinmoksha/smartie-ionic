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
  public apiCompletedCount: number = 0;

  constructor(public navCtrl: NavController, private dataService: DataService, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController, private analytics: AnalyticsProvider) {
    this.dataService.currentPage = "NotificationFeedPage";
    this.analytics.setScreenName("NotificationFeed");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("NotificationFeed", "View"));
  }

  ionViewDidLoad() {
    console.log("view loaded");
  }

  ionViewDidEnter() {
    this.loadNotifications();
    this.allAccepteds = [];
    this.allUpcomings = [];
    this.allRequesteds = [];
    this.apiCompletedCount = 0;
  }

  loadNotifications() {
    this.storage.get('UserProfile').then(profile => {
      this.profileId = profile.profileData.objectId;
      this.userRole = profile.profileData.role;
      this.fetchAllAcceptedReq(this.profileId, this.userRole);
      this.fetchAllRequested(this.profileId, this.userRole);
      this.fetchAllUpcomingsReq(this.profileId, this.userRole);

    })
  }

  async fetchAllAcceptedReq(profileId, role) {
    return await this.dataService.getApi(
      'getAllAccepteds',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async jobReq => {
        this.apiCompletedCount += 1;
        if (jobReq)
          this.allAccepteds = jobReq.result; // jobReq[0], jobReq.data[0]???
          console.log("All Accepted");
          console.log(this.allAccepteds);
      }, (err) => {
        this.apiCompletedCount += 1;
      })
    });
  }

  async fetchAllRequested(profileId, role) {
    return await this.dataService.getApi(
      'getAllRequesteds',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async jobReq => {
        this.apiCompletedCount += 1;
        if (jobReq)
          this.allRequesteds = jobReq.result; // ???
          console.log("All Requested");
          console.log(this.allRequesteds);
      }, (err) => {
        this.apiCompletedCount += 1;
        console.log(err);
      })
    });
  }

  async fetchAllUpcomingsReq(profileId, role) {
    return await this.dataService.getApi(
      'getAllUpcomings',
      { profileId: profileId, role: role }
    ).then(async API => {
      return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async jobReq => {
        this.apiCompletedCount += 1;
        if (jobReq)
          this.allUpcomings = jobReq.result; // ????
          console.log("All Upcomings");
          console.log(this.allUpcomings);
      }, (err) => {
        this.apiCompletedCount += 1;
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
    let navigationParams = Object.assign({}, ...notification);
    navigationParams.role = this.userRole != 'teacher' ? notification.teacherProfile.role : notification.otherProfile.role;
    navigationParams.fromWhere = requestState;
    navigationParams.jobRequestId = navigationParams.objectId;
    this.navCtrl.push("JobRequestPage", { params: navigationParams });
  }
}
