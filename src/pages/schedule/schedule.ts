import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";

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

  private genericAvatar: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.params = this.navParams.get("params");
    console.log('Schedule Page');
    console.log(this.params);

    let UTCStartTime = new Date(Date.UTC(this.params.defaultStartDate.split('-')[2], this.params.defaultStartDate.split('-')[0], this.params.defaultStartDate.split('-')[1], this.params.defaultStartTime.split(':')[0], this.params.defaultStartTime.split(':')[1]));

    let UTCEndTime = new Date(Date.UTC(this.params.defaultEndDate.split('-')[2], this.params.defaultEndDate.split('-')[0], this.params.defaultEndDate.split('-')[1], this.params.defaultEndTime.split(':')[0], this.params.defaultEndTime.split(':')[1]));
      // let zone = userTimeZone;
      // let GMT = zone.substring(4);

    this.params.UTCStartTime = UTCStartTime.getHours() + ':' + UTCStartTime.getMinutes();
    this.params.UTCEndTime = UTCEndTime.getHours() + ':' + UTCEndTime.getMinutes();
    
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
    let endDateComponents = this.params.defaultEndDate.split('-');
    let defaultEndMonth = endDateComponents[0];
    let defaultEndDate = endDateComponents[1];
    let defaultEndYear = endDateComponents[2];

    const options: CalendarModalOptions = {
      pickMode: 'multi',
      from: new Date(),
      to: new Date(defaultEndYear, defaultEndMonth-1, defaultEndDate),
      cssClass: this.userRole
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.navCtrl.push("TimeSelectorMultiPage", { selectedDates: date, params: this.params, loggedRole: this.userRole });
        /* let popover = this.popoverCtrl.create("TimeSelectorPage", { selectedDate: date.months + '-' + date.date + '-' + date.years, params: this.params, loggedRole: this.userRole });
        popover.present();
        popover.onDidDismiss( data => {
          console.log('dismiss');
          // console.log(data);
          this.navCtrl.push("PaymentPage", {
            totalHours: data.totalHours,
            totalAmount: data.totalAmount,
            apptDate: data.apptDate,
            apptStartTime: data.apptStartTime,
            apptEndTime: data.apptEndTime,
            params: data.params
          });
        }) */
      }
    })
  }
}
