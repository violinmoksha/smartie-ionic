import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { UtilsProvider } from '../../providers/utils';
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
  public appointments: any = null;
  public schedules: any = null;
  public isFetching: boolean = false;
  private profileData: any;
  scehduleStatus: string = "ongoing";

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public loadingCtrl: LoadingController, private dataService: DataService, private analytics : AnalyticsProvider, private utilsService: UtilsProvider) {
    this.analytics.setScreenName("ViewAppointment");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("ViewAppointment", "View"));
    this.role = this.navParams.get('role');
    this.scehduleStatus = this.navParams.get('scheduleStatus');
  }

  getRole() {
    return this.role;
  }

  fetchAppoinments() {
    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.isFetching = true;
      this.dataService.getApi(
        'getActiveAppointments',
        { role: this.role, profileId: profile.profileData.objectId }
      ).then(API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          this.isFetching = false;
          console.log(response)

          if (response.result.length > 0) {
            console.log("Got Schedules");
            this.schedules = response.result;
            console.log(this.schedules)
            for(let schedule of this.schedules){
              if(this.role == 'teacher'){
                schedule.owner = schedule.otherProfile.fullname;
                this.profileData = schedule.otherProfile;
              }else{
                schedule.owner = schedule.teacherProfile.fullname;
                this.profileData = schedule.teacherProfile;
              }
              let apptStartDate, apptStartTime, apptEndDate, apptEndTime;
              for(let appointment of schedule.appointmentTimings){
                apptStartDate = new Date(appointment.apptStartDateTime);
                apptStartTime = this.utilsService.formatTime(apptStartDate).split('T')[1];
                apptEndDate = new Date(appointment.apptEndDateTime);
                apptEndTime = this.utilsService.formatTime(apptEndDate).split('T')[1];


                appointment.startDate = apptStartDate.getDate() + '-' + (apptStartDate.getMonth() + 1) + '-' + apptStartDate.getFullYear();
                appointment.endDate = apptEndDate.getDate() + '-' + (apptEndDate.getMonth() + 1) + '-' + apptEndDate.getFullYear();

                appointment.startTime = parseInt(apptStartTime.split(':')[0]) +':'+ parseInt(apptStartTime.split(':')[1]);
                appointment.endTime = parseInt(apptEndTime.split(':')[0]) +':'+ parseInt(apptEndTime.split(':')[1]);
              }
            }
          }
        }, err => {
          console.log(err);
          this.isFetching = false;
        });
      })
    });
  }

  reviewProfile(appointment){
    if(this.role == 'teacher'){
      this.profileData = appointment.otherProfile;
    }else{
      this.profileData = appointment.teacherProfile;
    }

    this.navCtrl.push("SetReviewPage", { profileData: this.profileData, jobRequestId: appointment.jobRequestId.objectId });
  }

  ionViewDidEnter() {
    this.fetchAppoinments();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAppointmentPage');
  }

}
