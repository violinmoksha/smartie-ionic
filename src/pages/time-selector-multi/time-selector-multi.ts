import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TimeSelectorMultiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-time-selector-multi',
  templateUrl: 'time-selector-multi.html',
})
export class TimeSelectorMultiPage {

  selectedDates: any;
  params: any;
  loggedRole: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedDates = this.navParams.get("selectedDates");
    this.params = this.navParams.get("params");
    this.loggedRole = this.navParams.get("loggedRole");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeSelectorMultiPage');
  }

  timeSet(date,testContent){
    console.log(testContent);
    console.log(date);
  }

}
