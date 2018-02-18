import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.params = this.navParams.data.params;
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  selectSchedule() {
    // TODO: launch datepicker, blocked according to deafaultStartEndDateTimes
  }
}
