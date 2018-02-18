import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params = this.navParams.data.params;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  selectSchedule() {

  }
}
