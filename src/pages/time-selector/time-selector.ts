import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

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

  private selectedDate: string;
  public readyToPay: boolean = false;
  private totalHours: any;
  private totalAmount: number;
  private params: any;
  public loggedRole: any;

  public event = {
    timeStarts: '10:00',
    timeEnds: '11:00'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.selectedDate = this.navParams.data.selectedDate;
    this.params = this.navParams.data.params;
    this.loggedRole = this.navParams.data.loggedRole;
  }

  timeSet(){
    let alert;
    if(this.event.timeStarts > this.event.timeEnds){
      alert = this.alertCtrl.create({
        title: 'Scheduling...',
        subTitle: 'Please keep in mind, Start Time should be before End Time ;-)',
        buttons: ['OK']
      });

      alert.present();
      this.readyToPay = false;
    }else if(this.params.defaultStartTime > this.event.timeStarts || this.params.defaultEndTime < this.event.timeEnds){
      alert = this.alertCtrl.create({
        title: 'Scheduling...',
        subTitle: 'Please choose amongst the available times!',
        buttons: ['OK']
      });

      alert.present();
      this.readyToPay = false;
    }else{
      let tmpArr = this.selectedDate.split('-');

      let timeStarts_ms = new Date(parseInt(tmpArr[2]), parseInt(tmpArr[0]), parseInt(tmpArr[1]), parseInt(this.event.timeStarts.split(':')[0]), parseInt(this.event.timeStarts.split(':')[1])).getTime();
      let timeEnds_ms = new Date(parseInt(tmpArr[2]), parseInt(tmpArr[0]), parseInt(tmpArr[1]), parseInt(this.event.timeEnds.split(':')[0]), parseInt(this.event.timeEnds.split(':')[1])).getTime();

      let diffMs = timeEnds_ms - timeStarts_ms;

      // Convert back to days and return
      let diffHrs = Math.floor((diffMs % 86400000) / 3600000) * 60;
      let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

      this.totalHours = (diffHrs + diffMins) / 60;
      this.totalAmount = this.totalHours * this.params.prefPayRate;
      this.readyToPay = true;
    }
  }

  goPay(){
    this.viewCtrl.dismiss({
      totalHours: this.parseHours(this.totalHours),
      totalAmount: this.smartieTotal(this.totalAmount),
      apptDate: this.selectedDate,
      apptStartTime: this.event.timeStarts,
      apptEndTime: this.event.timeEnds,
      params: this.params
    });
  }

  ionViewDidLoad() {
  }

  parseMoney(val) {
    return val.toFixed(2);
  }

  parseHours(val) {
    return val.toFixed(1);
  }

  smartieFee(val) {
    val = val * .2; // 20% fee
    return val.toFixed(2);
  }

  smartieTotal(val) {
    val = val + (val * .2); // 20% fee
    return val.toFixed(2);
  }
}
