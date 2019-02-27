import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the ViewAppointmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-appointment',
  templateUrl: 'view-appointment.html',
})
export class ViewAppointmentPage {

  private role: any;
  public appointments: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public loadingCtrl: LoadingController, private dataService: DataService, private analytics : AnalyticsProvider) {
    this.analytics.setScreenName("ViewAppointment");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("ViewAppointment", "View"));

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;

      this.dataService.getApi(
        'getActiveAppointments',
        { role: this.role, profileId: profile.profileData.objectId }
      ).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          this.appointments = response.result;
          for(let appointment of this.appointments){
            let apptStartDate = new Date(appointment.apptStartDateTime.iso);
            let apptStartTime = this.formatTime(apptStartDate).split('T')[1];
            let apptEndDate = new Date(appointment.apptEndDateTime.iso);
            let apptEndTime = this.formatTime(apptEndDate).split('T')[1];

            appointment.startDate = apptStartDate.getDate() + '-' + (apptStartDate.getMonth() + 1) + '-' + apptStartDate.getFullYear();

            appointment.endDate = apptEndDate.getDate() + '-' + (apptEndDate.getMonth() + 1) + '-' + apptEndDate.getFullYear();

            appointment.startTime = parseInt(apptStartTime.split(':')[0]) +':'+ parseInt(apptStartTime.split(':')[1]);
            appointment.endTime = parseInt(apptEndTime.split(':')[0]) +':'+ parseInt(apptEndTime.split(':')[1]);
          }
        });
      })
    });
  }

  formatTime(dateTime) {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    return dateTime.getFullYear() +
        '-' + pad(dateTime.getMonth() + 1) +
        '-' + pad(dateTime.getDate()) +
        'T' + pad(dateTime.getHours()) +
        ':' + pad(dateTime.getMinutes()) +
        ':' + pad(dateTime.getSeconds()) +
        '.' + (dateTime.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAppointmentPage');
  }

}
