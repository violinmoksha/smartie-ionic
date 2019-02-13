import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';

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
  timeZone: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage, private dataService: DataService) {
    this.selectedDates = this.navParams.get("selectedDates");
    this.params = this.navParams.get("params");
    this.loggedRole = this.navParams.get("loggedRole");

    if(this.navParams.get("scheduled")){
      this.calGrossAmount();
      this.calGrossHours();
      this.readyToPay = true;
    }

    this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

    for(let selectedDate of this.selectedDates){
      let timeZoneStartTime = new Date(selectedDate.years, selectedDate.months, selectedDate.date, 10);
      let timeZoneEndTime = new Date(selectedDate.years, selectedDate.months, selectedDate.date, 23);
      selectedDate.startTime = selectedDate.startTime? selectedDate.startTime : timeZoneStartTime.toLocaleTimeString();
      selectedDate.endTime = selectedDate.endTime? selectedDate.endTime : timeZoneEndTime.toLocaleTimeString();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeSelectorMultiPage');
  }

  timeSet(date,i){

    if((date.months + '-' + date.date + '-' + date.years) && (date.startTime > date.endTime) ){
      this.timeScheduleError(date.months + '-' + date.date + '-' + date.years, 1);
    }else if((date.months + '-' + date.date + '-' + date.years) && (this.params.defaultStartTime > date.startTime || this.params.defaultEndTime < date.endTime) ){
      this.timeScheduleError(date.months + '-' + date.date + '-' + date.years, 2);
    }else{

      let timeStarts_ms = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.startTime.split(':')[0]), parseInt(date.startTime.split(':')[1])).getTime();

      date.UTCstartTime = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.startTime.split(':')[0]), parseInt(date.startTime.split(':')[1]));

      let timeEnds_ms = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.endTime.split(':')[0]), parseInt(date.endTime.split(':')[1])).getTime();

      date.UTCendTime = new Date(parseInt(date.years), parseInt(date.months), parseInt(date.date), parseInt(date.endTime.split(':')[0]), parseInt(date.endTime.split(':')[1]));

      date.diffMs = timeEnds_ms - timeStarts_ms;
      date.diffHrs = Math.floor((date.diffMs % 86400000) / 3600000) * 60;
      date.diffMins = Math.round(((date.diffMs % 86400000) % 3600000) / 60000);

      date.totalHours = (date.diffHrs + date.diffMins) / 60;
      date.totalAmount = date.totalHours * this.params.prefPayRate;
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
    this.grossAmount = 0;
    for(let selectedDate of this.selectedDates){
      if(selectedDate.totalAmount)
        this.grossAmount += selectedDate.totalAmount;
    }
  }

  calGrossHours(){
    this.grossHours = 0;
    for(let selectedDate of this.selectedDates){
      if(selectedDate.totalHours)
        this.grossHours += selectedDate.totalHours;
    }
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

    this.storage.get("UserProfile").then(profile => {
      profile.profileData.scheduleDetails = {'scheduled': true, 'selectedDates': this.selectedDates, 'totalHours': this.parseHours(this.grossHours), 'totalAmount': this.smartieTotal(this.grossAmount)}
      this.dataService.updateUserProfileStorage(profile.profileData);

      this.navCtrl.push("PaymentPage", {
        selectedDates: this.selectedDates,
        totalHours: this.parseHours(this.grossHours),
        totalAmount: this.smartieTotal(this.grossAmount),
        params: this.params
      });
    });
  }
}
