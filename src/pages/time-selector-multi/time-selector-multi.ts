import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  startTime: any = [];
  endTime: any = [];
  private readyToPay: boolean = false;
  grossAmount: number = 0;
  grossHours: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.selectedDates = this.navParams.get("selectedDates");
    this.params = this.navParams.get("params");
    this.loggedRole = this.navParams.get("loggedRole");    

    for(let selectedDate of this.selectedDates){
      selectedDate.startTime = '10:00';
      selectedDate.endTime = '11:00';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeSelectorMultiPage');
  }

  timeSet(date,i){
    /* console.log(i);
    console.log(date.months + '-' + date.date + '-' + date.years);
    console.log(date.startTime);
    console.log(date.endTime); */

    if((date.months + '-' + date.date + '-' + date.years) && (date.startTime > date.endTime) ){
      this.timeScheduleError(date.months + '-' + date.date + '-' + date.years, 1);
    }else if((date.months + '-' + date.date + '-' + date.years) && (this.params.defaultStartTime > date.startTime || this.params.defaultEndTime < date.endTime) ){
      this.timeScheduleError(date.months + '-' + date.date + '-' + date.years, 2);
    }else{
      let timeStarts_ms = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.startTime.split(':')[0]), parseInt(date.startTime.split(':')[1])).getTime();

      let timeEnds_ms = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.endTime.split(':')[0]), parseInt(date.endTime.split(':')[1])).getTime();

      date.diffMs = timeEnds_ms - timeStarts_ms;
      date.diffHrs = Math.floor((date.diffMs % 86400000) / 3600000) * 60;
      date.diffMins = Math.round(((date.diffMs % 86400000) % 3600000) / 60000);

      date.totalHours = (date.diffHrs + date.diffMins) / 60;
      date.totalAmount = date.totalHours * this.params.prefPayRate;
      // console.log(date.diffMs);
      // this.grossAmount += date.totalAmount;
      // console.log(this.grossAmount);
      this.calGrossAmount();
      this.calGrossHours();
      this.readyToPay = true;
    }
  }

  timeScheduleError(date, errorType){
    let alert;
    if(errorType == 1){
      alert = this.alertCtrl.create({
        title: date + ' Scheduling...',
        subTitle: 'Please keep in mind, Start Time should be before End Time ;-)',
        buttons: ['OK']
      });
  
      alert.present();
      this.readyToPay = false;
    }
    if(errorType == 2){
      alert = this.alertCtrl.create({
        title: date + ' Scheduling...',
        subTitle: 'Please choose amongst the available times!',
        buttons: ['OK']
      });

      alert.present();
      this.readyToPay = false;
    }else{
      console.log('Clear');
    }
  }

  calGrossAmount(){
    console.log(this.selectedDates);
    this.grossAmount = 0;
    for(let selectedDate of this.selectedDates){
      if(selectedDate.totalAmount)
        this.grossAmount += selectedDate.totalAmount;
    }
    console.log(this.grossAmount)
  }

  calGrossHours(){
    this.grossHours = 0;
    for(let selectedDate of this.selectedDates){
      if(selectedDate.totalHours)
        this.grossHours += selectedDate.totalHours;
    }
    console.log(this.grossHours)
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

  goPay(){
    console.log(this.selectedDates);
    console.log(this.parseHours(this.grossHours));
    console.log(this.smartieTotal(this.grossAmount));
    console.log(this.params);

    this.navCtrl.push("PaymentPage", {
      apptDateTime: this.selectedDates,
      totalHours: this.parseHours(this.grossHours),
      totalAmount: this.smartieTotal(this.grossAmount),
      params: this.params
    })
  }
}
