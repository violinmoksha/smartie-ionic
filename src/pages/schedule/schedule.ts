import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
  private startDate: string;
  private endDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.params = this.navParams.data;
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  pickDateCalendar() {
    let endDateComponents = this.params.defaultEndDate.split('-');
    let defaultEndMonth = endDateComponents[0];
    let defaultEndDate = endDateComponents[1];
    let defaultEndYear = endDateComponents[2];

    const options: CalendarModalOptions = {
      pickMode: 'single',
      from: new Date(),
      to: new Date(defaultEndYear, defaultEndMonth-1, defaultEndDate)
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        let modal = this.modalCtrl.create("TimeSelectorPage", { selectedDate: date.months + '-' + date.date + '-' + date.years });
        modal.present();
      }
    })
  }
}
