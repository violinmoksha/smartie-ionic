import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  private readyToPay: boolean = false;
  private totalHours: any;
  private prefPayRate: number;
  private totalAmount: number;

  public event = {
    timeStarts: '00:00',
    timeEnds: '23:59'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.selectedDate = this.navParams.data.selectedDate;
    this.startTime = this.navParams.data.startTime;
    this.endTime = this.navParams.data.endTime;
    this.prefPayRate = this.navParams.data.prefPayRate;
  }

  timeSet(){
    let alert;
    if(this.event.timeStarts > this.event.timeEnds){
      alert = this.alertCtrl.create({
        title: 'Payment Failed !',
        subTitle: 'Start Time should less than End Time',
        buttons: ['OK']
      });

      alert.present();
      this.readyToPay = false;
    }else if(this.startTime > this.event.timeStarts || this.endTime < this.event.timeEnds){
      alert = this.alertCtrl.create({
        title: 'Payment Failed !',
        subTitle: 'Please choose between availabile time',
        buttons: ['OK']
      });

      alert.present();
      this.readyToPay = false;
    }else{
      var timeStarts = new Date(this.selectedDate+ ' ' + this.event.timeStarts);
      var timeStarts_ms = timeStarts.getTime();

      var timeEnds = new Date(this.selectedDate+ ' ' + this.event.timeEnds);
      var timeEnds_ms = timeEnds.getTime();

      var diffMs = timeEnds_ms - timeStarts_ms;
      // Convert back to days and return
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000) * 60;
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

      this.totalHours = (diffHrs + diffMins) / 60;
      console.log(this.totalHours);
      console.log(this.prefPayRate);
      this.totalAmount = this.totalHours * this.prefPayRate;
      this.readyToPay = true;
    }
  }

  goPay(){
    this.navCtrl.push("PaymentPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeSelectorPage');
  }

}
