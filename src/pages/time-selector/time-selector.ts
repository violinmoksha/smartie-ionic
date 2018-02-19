import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TimeSelectorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-time-selector',
  templateUrl: 'time-selector.html',
})
export class TimeSelectorPage {

  private startTime: string;
  private endTime: string;
  private selectedDate: string;

  public event = {
    timeStarts: '00:00',
    timeEnds: '23:59'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedDate = this.navParams.data.selectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeSelectorPage');
  }

}
