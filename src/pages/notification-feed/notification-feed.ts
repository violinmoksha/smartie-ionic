import { Response } from './../../providers/data-model/data-model';
import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { SmartieAPI } from '../../providers/api/smartie';


/**
 * Generated class for the AllAcceptedsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-notification-feed',
  templateUrl: 'notification-feed.html',
})
export class NotificationFeedPage {
  public allAccepteds:Array<{}>=[];
  public allRequesteds: Array<{}>=[];
  public allUpcomings: Array<{}>=[];
  private userRole: any;
  private profileId:any;

  constructor(public navCtrl: NavController,private smartieApi: SmartieAPI, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController,private analytics : AnalyticsProvider) {

    this.analytics.setScreenName("NotificationFeed");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("NotificationFeed", "View"));

    console.log(this.allAccepteds);
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(profile => {
      this.profileId = profile.profileData.objectId;
      this.userRole = profile.profileData.role;
      this.fetchAllAcceptedReq(this.profileId,this.userRole);
      this.fetchAllRequested(this.profileId,this.userRole);
      this.fetchAllUpcomingsReq(this.profileId,this.userRole);


      // this.storage.get("userAllAccepteds").then(allAccepteds => {
      //   this.allAccepteds = allAccepteds;
      // });

      // this.storage.get("userAllRequesteds").then(allRequesteds => {
      //   this.allRequesteds = allRequesteds;
      // });

      // this.storage.get("userAllUpcomings").then(allUpcomings => {
      //   this.allUpcomings = allUpcomings;
      // })

      console.log(this.allAccepteds);
      console.log(this.allRequesteds);
      console.log(this.allUpcomings);

      // this.userRole = profile.profileData.role;
    })
  }

  async fetchAllAcceptedReq(profileId, role){
    let API = await this.smartieApi.getApi(
      'getAllAccepteds',
      { profileId:profileId, role: role }
    );
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(jobReq => {
      if(jobReq)
      this.allAccepteds = jobReq.result;

      console.log(jobReq);
    },(err)=>{
      console.log(err);
    })
  }

  async fetchAllRequested(profileId, role){
    let API = await this.smartieApi.getApi(
      'getAllRequesteds',
      { profileId:profileId, role: role }
    );
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(jobReq => {
      if(jobReq)
      this.allRequesteds = jobReq.result;
      console.log(jobReq);
    },(err)=>{
      console.log(err);
    })
  }

  async fetchAllUpcomingsReq(profileId, role){
    let API = await this.smartieApi.getApi(
      'getAllUpcomings',
      { profileId:profileId, role: role }
    );
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(jobReq => {
      if(jobReq)
      this.allUpcomings = jobReq.result;

      console.log(jobReq);
    },(err)=>{
      console.log(err);
    })
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

  showJobRequest(notification, requestState){
    if(this.userRole != 'teacher'){
      this.navCtrl.push("JobRequestPage", { params: {
          jobRequestId: notification.objectId,
          profilePhoto: notification.teacherProfile.profilePhoto,
          profileStripeAccount: notification.teacherProfile.stripeCustomer,
          fullname: notification.teacherProfile.fullname,
          role: notification.teacherProfile.role,
          profileTitle: notification.teacherProfile.profileTitle,
          profileAbout: notification.teacherProfile.profileAbout,
          prefLocation: notification.teacherProfile.prefLocation,
          teacherProfileId: notification.teacherProfile.objectId,
          otherProfileId: notification.otherProfile.objectId,
          prefPayRate: notification.teacherProfile.prefPayRate,
          // defaultStartDate: notification.teacher.defaultStartDate,
          // defaultEndDate: notification.teacher.defaultEndDate,
          // defaultStartTime: notification.teacher.defaultStartTime,
          // defaultEndTime: notification.teacher.defaultEndTime,
          fromWhere: requestState,
          defaultStartDateTime: notification.teacher.defaultStartDateTime,
          defaultEndDateTime: notification.teacher.defaultEndDateTime,
        }
      })
    }else{
      this.navCtrl.push("JobRequestPage", { params: {
          jobRequestId: notification.objectId,
          profilePhoto: notification.otherProfile.profilePhoto,
          profileStripeAccount: notification.otherProfile.stripeCustomer,
          fullname: notification.otherProfile.fullname,
          role: notification.otherProfile.role,
          profileTitle: notification.otherProfile.profileTitle,
          profileAbout: notification.otherProfile.profileAbout,
          prefLocation: notification.otherProfile.prefLocation,
          teacherProfileId: notification.teacherProfile.objectId,
          otherProfileId: notification.otherProfile.objectId,
          prefPayRate: notification.teacherProfile.prefPayRate,
          // defaultStartDate: notification.teacher.defaultStartDate,
          // defaultEndDate: notification.teacher.defaultEndDate,
          // defaultStartTime: notification.teacher.defaultStartTime,
          // defaultEndTime: notification.teacher.defaultEndTime,
          fromWhere: requestState,
          defaultStartDateTime: notification.teacher.defaultStartDateTime,
          defaultEndDateTime: notification.teacher.defaultEndDateTime,
        }
      })
    }
  }
}
