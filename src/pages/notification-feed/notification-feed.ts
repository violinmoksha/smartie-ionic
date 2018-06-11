import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  private allAccepteds: any;
  private allRequesteds: any;
  private allUpcomings: any;
  private userRole: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(profile => {

      this.storage.get("userAllAccepteds").then(allAccepteds => {
        this.allAccepteds = allAccepteds;
      });

      this.storage.get("userAllRequesteds").then(allRequesteds => {
        this.allRequesteds = allRequesteds;
      });

      this.storage.get("userAllUpcomings").then(allUpcomings => {
        this.allUpcomings = allUpcomings;
      })

      console.log(this.allAccepteds);
      console.log(this.allRequesteds);
      console.log(this.allUpcomings);

      this.userRole = profile.profileData.role;
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
