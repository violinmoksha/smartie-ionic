import { IonicPage, Events } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

declare var google;

/**
 * Generated class for the SmartieSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-smartie-search',
  templateUrl: 'smartie-search.html',
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
  private alert: any;
  private notifyCount: any;
  private latLngUser: any;
  private marker: any;
  //private searchData: any;
  //private alertOpts: any;
  // private infoWindow: any;

  private alertCtrl: AlertController;

  public searchLogo = '/assets/imgs/smartie-horzontal-logo.png';

  public notifications: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, public modalCtrl: ModalController, public events: Events, private storage: Storage) {
    this.role = navParams.data.role;
    this.fromWhere = navParams.data.fromWhere;
    this.alert = this.alertCtrl;
    if (navParams.data.notifications !== undefined) {
      this.notifications = navParams.data.notifications;
      this.notifyCount = this.notifications.length;
    } else {
      localStorage.clear(); // dump ephemeral session
      this.navCtrl.setRoot("LoginPage"); // send to Login
    }
  }

  ionViewDidEnter() {
    // send proper buttons into side-menu from here
    // since this is the first side-menu -loaded Page,
    // via SmartieApp's buttonsLoad custom Event
    this.events.publish("buttonsLoad", this.role);

  }

  ionViewDidLoad(){
    this.storage.get('UserProfile').then(profile => {
      if (profile == null) {
        this.navCtrl.setRoot("LoginPage");
      } else {
        this.latLngUser = profile.profileData.latlng;
        this.smartieSearchResult(this.latLngUser, profile.profileData.role, null);
        // this.initMap();
      }
    });
  }

  findJobsSearch(searchLoc){
    this.smartieSearchResult(null, this.navParams.data.role, searchLoc);
  }

  /*initMap(){
    let latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profileData.latlng;
    this.smartieSearchResult(latLngUser, this.navParams.data.role, null);
  }*/


  /*sendRequestProgress(alertCtrl) {
    this.navCtrl.removeView(alertCtrl, {
    }, () => {
      return new Promise((resolve, reject) => resolve('success'));
    });
  }*/

  createMarkerLocation(locationData){
    // TODO: there shud be a way to wrap this
    // so we don't need to include the frontend
    // SDK directly in our index.html
    console.log(locationData);
    let latLng = new google.maps.LatLng(locationData.latlng.latitude, locationData.latlng.longitude);

    if (this.role == 'teacher') {
      if(locationData.otherProfile.role == 'teacher'){
        this.userIcon = './assets/imgs/teacher-map-icon30px.png'
      }else if(locationData.otherProfile.role == 'parent'){
        this.userIcon = './assets/imgs/parent-map-icon30px.png'
      }else if(locationData.otherProfile.role == 'school'){
        this.userIcon = './assets/imgs/school-map-icon30px.png'
      }else if(locationData.otherProfile.role == 'student'){
        this.userIcon = './assets/imgs/student-map-icon30px.png'
      }
    } else {
      this.userIcon = './assets/imgs/teacher-map-icon30px.png';
    }

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: this.userIcon
    });
    //this.bounds.extend(latLng);

    if(locationData.profilePhoto){
      this.profilePhoto = locationData.profilePhoto.url;
    }else{
      this.profilePhoto = './assets/imgs/user-round-icon.png';
    }

    this.marker.addListener('click', ()=> {

      let params;
      if (this.role !== 'teacher') {
        params = {
          profilePhoto: locationData.teacherProfile.profilePhoto,
          fullname: locationData.teacherProfile.fullname,
          role: locationData.teacherProfile.role,
          prefPayRate: locationData.teacherProfile.prefPayRate,
          yrsExperience: locationData.teacherProfile.yrsExperience,
          profileAbout: locationData.teacherProfile.profileAbout,
          profileTitle: locationData.teacherProfile.profileTitle,
          jobDescrioption: locationData.jobDescription,
          prefLocation: locationData.prefLocation,
          phone: locationData.teacherProfile.phone,
          teacherProfileId: locationData.teacherProfile.objectId,
          loggedRole: this.role,
          defaultStartDate: locationData.teacherProfile.defaultStartDate,
          defaultEndDate: locationData.teacherProfile.defaultEndDate,
          defaultStartTime: locationData.teacherProfile.defaultStartTime,
          defaultEndTime: locationData.teacherProfile.defaultEndTime,
        };
      } else {
        params = {
          profilePhoto: locationData.otherProfile.profilePhoto,
          fullname: locationData.otherProfile.fullname,
          role: locationData.otherProfile.role,
          profileAbout: locationData.otherProfile.profileAbout,
          profileTitle: locationData.otherProfile.profileTitle,
          jobDescription: locationData.jobDescription,
          prefPayRate: locationData.otherProfile.prefPayRate,
          prefLocation: locationData.prefLocation,
          phone: locationData.otherProfile.phone,
          otherProfileId: locationData.otherProfile.objectId,
          loggedRole: this.role
        }
      }
      this.navCtrl.push("JobRequestPage", { params: params });
    });

    // this.marker.setMap(this.map);
    // this.map.setZoom(5);
    // // map.setCenter(marker.getPosition());
    // // map.panTo(marker.getPosition())
    // this.map.fitBounds(this.bounds);
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

  smartieSearchResult(latLng, searchRole, searchLoc){
    let mapCenter;
    if(latLng !== null){
      mapCenter = latLng;
    } else if (searchLoc !== null) {
      // TODO: this now needs to do a quick geocoder call
      mapCenter = this.notifications[0].latLng;
    }
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // map always should cover 200km radius from Profile user
    // thus the actual applied trigonometry yaaaaaaay!!!!^$%^
    let radiusInKm = 50;
    let pointSouthwest = this.destinationPoint(220, radiusInKm / 2, mapCenter);
    let pointNortheast = this.destinationPoint(45, radiusInKm / 2, mapCenter);
    this.bounds = new google.maps.LatLngBounds(pointSouthwest, pointNortheast);

    for(let searchResult of this.notifications){
      this.createMarkerLocation(searchResult);
    }

    //let myPlace = new google.maps.LatLng(34.0522, -118.2437);
    //this.bounds.extend(myPlace);

    //this.marker.setMap(this.map);
    //this.map.setZoom(5);
    // map.setCenter(marker.getPosition());
    // map.panTo(marker.getPosition())
    this.map.fitBounds(this.bounds);
  }

  pushAccepteds(){
    this.navCtrl.push("NotificationFeedPage", { activeRole: this.role });
  }
}
