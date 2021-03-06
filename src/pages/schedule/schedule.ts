import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  private params: any;
  private userRole: string;
  timeZone: any;

  public genericAvatar: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public popoverCtrl: PopoverController, private analytics: AnalyticsProvider) {
    this.analytics.setScreenName("Schedule");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Schedule", "View"));

    this.params = this.navParams.get("params");

    this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
    })

    let otherRole;
    if (this.userRole == 'teacher') {
      otherRole = this.params.role;
    } else {
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
  }

  ionViewDidLoad() {
  }

  pickDateCalendar() {
    let endDateComponents = this.params.UTCendDate.split('-');
    let defaultEndMonth = endDateComponents[0];
    let defaultEndDate = endDateComponents[1];
    let defaultEndYear = endDateComponents[2];

    const options: CalendarModalOptions = {
      pickMode: 'multi',
      from: new Date(),
      to: new Date(defaultEndYear, defaultEndMonth - 1, defaultEndDate),
      cssClass: this.userRole
    };
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date) {
        this.navCtrl.push("TimeSelectorMultiPage", { selectedDates: date, params: this.params, loggedRole: this.userRole });
      }
    })
  }
}
