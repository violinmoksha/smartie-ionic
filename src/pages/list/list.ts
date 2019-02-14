import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, PopoverController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { UtilsProvider } from '../../providers/utils';
import { JobRequstProvider } from '../../providers/job-requst';

declare let google;

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  smartieList: Array<any> = [];
  smartieListAlias:Array<any> = [];
  userData: any;
  role: any;
  cityName: string;
  searchText: string;
  selectedLocation: any;
  editModeLocation = false;
  editModeButton = true;
  fetchingData: boolean = false;
  notifyCount: number = 0;
  hasUpcomings: boolean = false;
  body: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataService: DataService, private events: Events, private utils: UtilsProvider, public popoverCtrl: PopoverController, private jobRequestProvider: JobRequstProvider, public alertCtrl: AlertController) {
    this.role = navParams.get("role");
    this.searchText = this.role == 'teacher' ? 'Search students by subjects!' : 'Search your favourite subjects!';
  }

  ionViewDidEnter() {
    this.events.publish("buttonsLoad", this.role);
    this.storage.get("UserProfile").then(user => {
      this.userData = user;
      this.role = user.profileData.role;
      this.body = {
        profileId: user.profileData.objectId,
        role: user.profileData.role
      };
      if (!user.profileData.cityName) {
        this.utils.getSelectedCity().then((cityName: any) => {
          this.cityName = cityName;
        })
      } else {
        this.cityName = user.profileData.cityName;
      }
      this.fetchSmartieList(user);
      this.getNotificationCounts();
    });
  }

  ionViewDidLoad() {
    let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
    let autoCompleteOptions = { componentRestrictions: { country: 'us' } };

    let autocomplete = new google.maps.places.Autocomplete(input, autoCompleteOptions);
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      this.cityName = place.name;
      this.sortByLocation(place.name);
    });
  }

  sortByLocation(location) {
    this.smartieListAlias = this.smartieList;
    let locationList = [];
    this.smartieListAlias.forEach((value, key) => {
      if (value.prefLocation.includes(location)) {
        locationList.splice(0, 0, value);
      } else {
        locationList.push(value);
      }
    });
    this.smartieListAlias = locationList;
  }

  filterBysubject(e) {
    this.smartieListAlias = this.smartieList;
    var searchValue = e.target.value;
    this.smartieListAlias = this.smartieListAlias.filter(subject => {
       return (subject.profileTitle.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || subject.profileAbout.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
    })
  }

  //NOTE: Commented due to changes in fetching users from all of the locations
  // fetchJRbyLocation(location) {
  //   this.fetchingData = true;
  //   this.dataService.getApi(
  //     'usersByPrefLocation',
  //     { profileId: this.userData.profileData.objectId, role: this.userData.profileData.role, location:location }
  //   ).then(async API => {
  //     this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
  //     this.fetchingData = false;
  //       if (Notifications.result[0].length > 0) {
  //         this.dataService.sanitizeNotifications(Notifications.result[0]).then((notifications: Array<any>) => {
  //           console.log(notifications);
  //           this.smartieList = [];
  //           if (this.userData.profileData.role == "teacher") {
  //             for(let k=0; k<notifications.length; k++) {
  //               this.smartieList.push(notifications[k].otherProfile);
  //             }
  //           } else {
  //             for(let k=0; k<notifications.length; k++) {
  //               this.smartieList.push(notifications[k].teacherProfile);
  //             }
  //           }
  //           this.smartieListAlias = this.smartieList;
  //         })
  //       } else {
  //         this.smartieListAlias = [];
  //       }
  //     }, err => {
  //       this.fetchingData = false;
  //       console.log(err.error.error);
  //     });
  //   });
  // }

  fetchSmartieList(user) {
    this.smartieList = [];
      this.dataService.getApi(
        'fetchMarkers',
        { profileId: user.profileData.objectId, role: user.profileData.role }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
          return await this.dataService.sanitizeNotifications(Notifications.result).then((notifications: Array<any>) => {
            if (this.userData.profileData.role == "teacher") {
              for(let k=0; k<notifications.length; k++) {
                notifications[k] = Object.assign({}, notifications[k], ...notifications[k].otherProfile);
                notifications[k].profilePhoto = notifications[k].otherProfile.profilePhoto ? notifications[k].otherProfile.profilePhoto : './assets/imgs/user-round-icon.png';
                this.smartieList.push(notifications[k]);
              }
            } else {
              for(let k=0; k<notifications.length; k++) {
                notifications[k] = Object.assign({}, notifications[k], ...notifications[k].teacherProfile);
                notifications[k].profilePhoto = notifications[k].teacherProfile.profilePhoto ? notifications[k].teacherProfile.profilePhoto : './assets/imgs/user-round-icon.png';
                this.smartieList.push(notifications[k].teacherProfile);
              }
            }
            this.smartieListAlias = this.smartieList;
          })
        }, err => {
          console.log(err.error.error);
        });
      });
  }

  openJobRequst(job) {
    if (this.role !== 'teacher') {
      job.role = job.teacherProfile.role;
    } else {
      job.role = job.otherProfile.role;
    }
    let popover = this.popoverCtrl.create("JobRequestPage", { params: job });
    popover.present();
  }

  getNotificationCounts(){
    this.jobRequestProvider.getNotificationCounts(this.body).then((values: any) => {
      this.notifyCount = values.notifyCount;
      this.hasUpcomings = values.hasUpcomings;
      if (this.hasUpcomings == true) {
        let title, subTitle;
        if (values.upcomingsCount == 1) {
          title = "You have an upcoming appointment!";
          subTitle = `You have one upcoming appointment. Be sure to show up on time! :)`;
        } else {
          title = "You have upcoming appointments";
          subTitle = `You have ${values.upcomingsCount} upcoming appointments! Be sure to show up on time!!`;
        }
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          buttons: [{
            text: 'OK',
            handler: () => {
              if (this.role !== 'teacher') {
                this.navCtrl.parent.select(3);
              } else {
                this.navCtrl.parent.select(4);
              }
            }
          }]
        });
        alert.present();
      } else if (this.notifyCount > 0) {
        let alert = this.alertCtrl.create({
          title: 'Wow, check it out!',
          subTitle: `You have ${this.notifyCount} active job request(s)! Tap OK to visit your Notifications page!`,
          buttons: [{
            text: 'OK',
            handler: () => {
              if (this.role !== 'teacher') {
                this.navCtrl.parent.select(3);
              } else {
                this.navCtrl.parent.select(4);
              }
            }
          }]
        });
        alert.present();
      }
    })
  }
  pushAccepteds() {
    if (this.role !== 'teacher') {
      this.navCtrl.parent.select(3);
    } else {
      this.navCtrl.parent.select(4);
    }
  }

}
