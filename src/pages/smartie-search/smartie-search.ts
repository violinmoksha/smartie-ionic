import { IonicPage, Events, PopoverController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
const Parse = require('parse');
import { Globalization } from '@ionic-native/globalization';
import { JobRequstProvider } from '../../providers/job-requst'

declare let google;

/**
 * Generated class for the SmartieSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage() @Component({
  selector: 'page-smartie-search',
  templateUrl: 'smartie-search.html'
})
export class SmartieSearch {

  @ViewChild('map') mapElement;
  map: any;
  bounds: any;
  private role: string;
  private fromWhere: string;
  private userIcon: string;
  private profilePhoto: string;
  private _contentTitle: string;
  private _contentMessage: string;
  private upcomingsCount: any = 0;
  private latLngUser: any;
  private marker: any;
  private body: any;
  private profilePhotoData: any;
  private schoolPhotoDataUrl: any;
  private teacherCv: any;
  private markerCount: Array<number> = []
  private radiusInKm: number = 50;
  private extendBound: boolean = false;
  private randomLocation: any;
  public notifications: any;
  public accepteds: any;
  private currentProfile: any;
  public userLocation: any;
  private notifyCount: any = 0;
  private requestedsCount: any = 0;
  private acceptedsCount: any = 0;

  private hasUpcomings: boolean = false;
  // TODO: autopopulate input with user's location
  // private reverseGeocodedLocation: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private storage: Storage, private dataService: DataService, public popoverCtrl: PopoverController, private globalization: Globalization, private ngZone: NgZone, private analytics: AnalyticsProvider, public jobRequestProvider: JobRequstProvider) {
    this.dataService.currentPage = "SmartieSearch";
    this.analytics.setScreenName("Smartie-search");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Smartie-search", "View"));

    this.role = navParams.get('role');

    let options = {
      formatLength: 'short',
      selector: 'date and time'
    }
    this.globalization.getDatePattern(options).then(res => {
      this.storage.set('userTimeZone', res.timezone);
      this.storage.set('utcOffset', res.utc_offset);
    }).catch(err => {
      console.log(err);
    })

    this.accepteds = [];
    this.fromWhere = navParams.get('fromWhere');

  }

  addProfilePhoto(profile) {
    let parseFile = new Parse.File('photo.jpg', { base64: this.profilePhotoData });
    parseFile.save({ useMasterKey: true }).then(file => {
      profile.set('profilePhoto', file);
      profile.save({ useMasterKey: true }).then(profile => {
        if (this.role == 'school') {
          if (this.schoolPhotoDataUrl) {
            let parseSchoolFile = new Parse.File('school.jpg', { base64: this.schoolPhotoDataUrl });
            parseSchoolFile.save({ useMasterKey: true }).then(schoolFile => {
              profile.set('schoolPhoto', schoolFile);
              profile.save({ useMasterKey: true }).then(school => {
                // TODO: run fetchNotifications here for the new user, same as in login.ts
              })
            })
          }
        }
      })
    }).catch(err => {
      console.log(JSON.stringify(err));
    })
  }

  ionViewDidEnter() {
    // send proper buttons into side-menu from here
    // since this is the first side-menu -loaded Page,
    // via SmartieApp's buttonsLoad custom Event
    this.events.publish("buttonsLoad", this.role);
    if (this.fromWhere == 'signUp') {
      let alert = this.alertCtrl.create({
        title: 'One more step to go!',
        subTitle: `Please check your email and click the verification link.`,
        buttons: [{
          text: 'OK',
        }]
      });
      alert.present();
    }

    this.getNotificationCounts();
  }

  ionViewDidLoad() {
    try {

      let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
      let autoCompleteOptions = { componentRestrictions: { country: 'us' } };

      let autocomplete = new google.maps.places.Autocomplete(input, autoCompleteOptions);
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        this.userLocation = place.formatted_address;
        this.findJobsSearch();
      });

      this.events.publish("buttonsLoad", this.role);

      this.storage.get('UserProfile').then(profile => {
        this.role = profile.profileData.role;
        this.currentProfile = profile.profileData;

        if (profile == null) {
          this.navCtrl.setRoot("LoginPage");
        } else {

          return new Promise(async (resolve) => {
            return await this.dataService.getApi(
              'fetchMarkers',
              { profileId: profile.profileData.objectId, role: profile.profileData.role }
            ).then(async API => {
              return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
                return await this.dataService.sanitizeNotifications(Notifications.result).then(async notifications => {
                  this.notifications = notifications;
                  return await this.storage.get('phoneLatLng').then(async phoneLatLng => {
                    if (phoneLatLng !== undefined && phoneLatLng !== null) {
                      this.smartieSearchResult(phoneLatLng, profile.profileData.role, null);
                    } else {
                      this.latLngUser = profile.profileData.latlng;
                      this.smartieSearchResult(this.latLngUser, profile.profileData.role, null);
                    }

                    //get all requested's
                    this.body = {
                      profileId: profile.profileData.objectId,
                      role: profile.profileData.role
                    };

                    this.getNotificationCounts();

                  });
                })
              }, err => {
                console.log(err.error.error);
                //this.smartieErrHandler.showErrors(err);
              });
            });

          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  getNotificationCounts(){
    this.jobRequestProvider.getNotificationCounts(this.body);
    Promise.all([
      this.getAllRequesteds(),
      this.getAllAccepteds(),
      this.getAllUpcomings()
    ]).then(value => {
      this.notifyCount = this.acceptedsCount + this.requestedsCount;
      if (this.hasUpcomings == true) {
        let title, subTitle;
        if (this.upcomingsCount == 1) {
          title = "You have an upcoming appointment!";
          subTitle = `You have one upcoming appointment. Be sure to show up on time! :)`;
        } else {
          title = "You have upcoming appointments";
          subTitle = `You have ${this.upcomingsCount} upcoming appointments! Be sure to show up on time!!`;
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
    });
  }


  getAllRequesteds() {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllRequesteds',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          this.requestedsCount = '';
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed == 0){
                this.requestedsCount++;
              }
            }
            // this.notifyCount = response.result.length;//response[0].result.length;
            this.storage.set("userAllRequesteds", response.result);
          }
          resolve('success');
        }, err => {
          console.log(err);
        })
      });
    })
  }

  getAllAccepteds() {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllAccepteds',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          this.acceptedsCount = 0;
          if (response.result.length > 0) {
            for(let result of response.result){
              if(result.viewed != 0 && this.currentProfile.objectId == result.sentBy.objectId && result.viewed != 2){
                this.acceptedsCount++
              }
            }
            this.storage.set("userAllAccepteds", response.result);
          }
          resolve('success');
        })
      });
    })
  }

  getAllUpcomings() {
    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'getAllUpcomings',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          if (response.result.length > 0) {
            this.hasUpcomings = true;
            this.upcomingsCount = response.result.length;

            this.notifyCount = this.notifyCount + response.result.length;
            this.storage.set("userAllUpcomings", response.result);
          }
          resolve('success');
        }, err => {
          console.log(err);
        })
      });
    })
  }

  getGeoPoint(searchLoc) {
    return new Promise(resolve => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': searchLoc
      }, function (results, status) {

        // hide actual geopoint
        let x0 = results[0].geometry.location.lng();
        let y0 = results[0].geometry.location.lat();

        // 5km rad as deg (reasonably close but not too far)
        let rd = 5000 / 111300, u = Math.random(), v = Math.random();
        let w = rd * Math.sqrt(u);
        let t = 2 * Math.PI * v;
        let x = w * Math.cos(t);
        let y = w * Math.sin(t);
        let xp = x / Math.cos(y0);

        let searchLocLatLng = new Parse.GeoPoint({
          latitude: y + y0,
          longitude: xp + x0
        });

        resolve(searchLocLatLng);
      });
    })
  }

  findJobsSearch() {
    this.getGeoPoint(this.userLocation).then(response => {
      this.smartieSearchResult(null, this.navParams.get("role"), response);
    });
  }

  createMarkerLocation(extendBound) {
    // TODO: there shud be a way to wrap this
    // so we don't need to include the frontend
    // SDK directly in our index.html
    try {
      let latLng;
      if(this.notifications.length > 0){
        for(let locationData of this.notifications){
          if (this.role == 'teacher') {
            if (locationData.otherProfile) {
              latLng = new google.maps.LatLng(locationData.otherProfile.latlng.latitude, locationData.otherProfile.latlng.longitude);

              this.randomLocation = this.randomGeo(locationData.otherProfile.latlng, 500);

              if (locationData.otherProfile.role == 'teacher') {
                this.userIcon = './assets/imgs/teacher-map-icon30px.png'
              } else if (locationData.otherProfile.role == 'parent') {
                this.userIcon = './assets/imgs/parent-map-icon30px.png'
              } else if (locationData.otherProfile.role == 'school') {
                this.userIcon = './assets/imgs/school-map-icon30px.png'
              } else if (locationData.otherProfile.role == 'student') {
                this.userIcon = './assets/imgs/student-map-icon30px.png'
              }
            }
          } else {
            latLng = new google.maps.LatLng(locationData.teacherProfile.latlng.latitude, locationData.teacherProfile.latlng.longitude);

            this.randomLocation = this.randomGeo(locationData.teacherProfile.latlng, 500);
            this.userIcon = './assets/imgs/teacher-map-icon30px.png';
          }

          this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(this.randomLocation.latitude, this.randomLocation.longitude),
            icon: this.userIcon
          });

          this.bounds.extend(latLng);

          if(extendBound) {
            // Extends our bounds to show US map
            var USBoundLocation = [
              [39.952583, -75.165222],
              [34.052235, -118.243683]
            ];

            for (var i = 0; i < USBoundLocation.length; i++) {
              let addonLatLng = new google.maps.LatLng(USBoundLocation[i][0], USBoundLocation[i][1]);
              this.bounds.extend(addonLatLng);
            }
          }

          if (locationData.profilePhoto) {
            this.profilePhoto = locationData.profilePhoto.url;
          } else {
            this.profilePhoto = './assets/imgs/user-round-icon.png';
          }

          this.marker.addListener('click', () => {

            this.ngZone.run(() => {
              this.initJobRequestPopUp(locationData);
            })
          });
        }
      }else{
        // Extends our bounds to show US map
        var USBoundLocation = [
          [39.952583, -75.165222],
          [34.052235, -118.243683]
        ];

        for (var i = 0; i < USBoundLocation.length; i++) {
          let addonLatLng = new google.maps.LatLng(USBoundLocation[i][0], USBoundLocation[i][1]);
          this.bounds.extend(addonLatLng);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  randomGeo(center, radius) {
    var y0 = center.latitude;
    var x0 = center.longitude;
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    return {
      'latitude': y + y0,
      'longitude': x + x0
    };
  }

  initJobRequestPopUp(locationData) {
    if (this.role !== 'teacher') {
      locationData.role = locationData.teacherProfile.role;
      locationData.fromWhere = "smartieSearch";
    } else {
      locationData.role = locationData.otherProfile.role;
      locationData.fromWhere = "smartieSearch";
    }
    let popover = this.popoverCtrl.create("JobRequestPage", { params: locationData });
    popover.present();
  }

  public contentTitle() {
    return this.sanitizer.bypassSecurityTrustHtml(this._contentTitle);
  }
  public contentMessage() {
    return this.sanitizer.bypassSecurityTrustHtml(this._contentMessage);
  }

  public toRad(pt) {
    return pt * Math.PI / 180;
  }

  public toDeg(pt) {
    return pt * 180 / Math.PI;
  }

  public destinationPoint(brng, dist, LatLng) {
    dist = dist / 6371;
    brng = this.toRad(brng);
    let lat1 = this.toRad(LatLng.latitude);
    let lon1 = this.toRad(LatLng.longitude);

    let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

    let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
      Math.cos(lat1),
      Math.cos(dist) - Math.sin(lat1) *
      Math.sin(lat2));

    if (isNaN(lat2) || isNaN(lon2)) return null;

    return new google.maps.LatLng(this.toDeg(lat2), this.toDeg(lon2));
  }

  smartieSearchResult(latLng, searchRole, searchLoc) {
    let mapCenter;
    if (latLng !== null) {
      mapCenter = latLng;
    } else if (searchLoc !== null) {
      mapCenter = searchLoc;
    }
    //console.log('smartieSearchResult debug: latLng == ' + JSON.stringify(latLng) + ' && searchLoc == ' + searchLoc);

    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.bounds = new google.maps.LatLngBounds();

    let locCount: number = 0;
    for (let searchResult of this.notifications) {
      let randomGeoUserLocation: any;
      if(this.role == "teacher"){
        randomGeoUserLocation = this.randomGeo(searchResult.otherProfile.latlng, 500);
      }else{
        randomGeoUserLocation = this.randomGeo(searchResult.teacherProfile.latlng, 500);
      }
      if(this.bounds.contains(new google.maps.LatLng(randomGeoUserLocation.latitude, randomGeoUserLocation.longitude))){
        locCount++;
      }
    }

    if(locCount < 5){
      this.bounds = new google.maps.LatLngBounds();
      this.extendBound = true;
      this.createMarkerLocation(this.extendBound);
    }else{
      let pointSouthwest = this.destinationPoint(220, this.radiusInKm / 2, mapCenter);
      let pointNortheast = this.destinationPoint(45, this.radiusInKm / 2, mapCenter);
      this.bounds = new google.maps.LatLngBounds(pointSouthwest, pointNortheast);
      this.extendBound = false;
      this.createMarkerLocation(this.extendBound);
    }

    this.map.fitBounds(this.bounds);
  }

  pushAccepteds() {
    if (this.role !== 'teacher') {
      this.navCtrl.parent.select(3);
    } else {
      this.navCtrl.parent.select(4);
    }
  }
}
