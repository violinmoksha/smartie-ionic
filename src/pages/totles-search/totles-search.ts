import { IonicPage, Events } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

declare var google;

/**
 * Generated class for the TotlesSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-totles-search',
  templateUrl: 'totles-search.html',
})
export class TotlesSearch {

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
  private searchData: any;
  //private alertOpts: any;
  // private infoWindow: any;

  private alertCtrl: AlertController;

  public searchLogo = '/assets/img/smartie-horzontal-logo.png';

  public jobRequests: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private sanitizer: DomSanitizer, public modalCtrl: ModalController, public events: Events, private storage: Storage) {
    this.role = navParams.data.role;
    this.fromWhere = navParams.data.fromwhere;
    this.jobRequests = navParams.data.jobRequests;
    this.notifyCount = this.jobRequests.length;
    this.alert = this.alertCtrl;
  }

  ionViewDidEnter() {
    // send proper buttons into side-menu from here
    // since this is the first side-menu -loaded Page,
    // via SmartieApp's buttonsLoad custom Event
    this.events.publish("buttonsLoad", this.role);

  }

  ionViewDidLoad(){
    this.storage.get('role').then(role => {
      this.storage.get(role+'UserProfile').then(profile => {
        this.latLngUser = JSON.parse(profile).profileData.latlng;
        this.totlesSearchResult(this.latLngUser, role, null);
        // this.initMap();
      });
    });
  }

  findJobsSearch(searchLoc){
    this.totlesSearchResult(null, this.navParams.data.role, searchLoc);
  }

  /*initMap(){
    let latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profileData.latlng;
    this.totlesSearchResult(latLngUser, this.navParams.data.role, null);
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
    let latLng = new google.maps.LatLng(locationData.latlng.latitude, locationData.latlng.longitude);

    if(locationData.role == 'teacher'){
      this.userIcon = './assets/img/teacher-map-icon30px.png'
    }else if(locationData.role == 'parent'){
      this.userIcon = './assets/img/parent-map-icon30px.png'
    }else if(locationData.role == 'school'){
      this.userIcon = './assets/img/school-map-icon30px.png'
    }else if(locationData.role == 'student'){
      this.userIcon = './assets/img/student-map-icon30px.png'
    }

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: this.userIcon
    });
    //this.bounds.extend(latLng);

    if(locationData.profilephoto){
      this.profilePhoto = locationData.profilephoto.url;
    }else{
      this.profilePhoto = './assets/img/user-round-icon.png';
    }

    locationData.profilePhoto = this.profilePhoto;
    // locationData.role = this.role;

    this.marker.addListener('click', ()=> {
      this.navCtrl.push('JobRequestPage', { result : locationData})
    })

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

  totlesSearchResult(latLng, searchRole, searchLoc){
    if(latLng !== null){
      this.searchData = { latlng: latLng, role: searchRole };
    }else if(searchLoc !== null){
      this.searchData = { role: searchRole, searchloc: searchLoc };
    }

    let API = this.smartieApi.getApi(
      'totlesSearch',
      this.searchData
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(searchResults => {
        let mapCenter;
        if(latLng !== null){
          mapCenter = latLng;
        } else if (searchLoc !== null) {
          mapCenter = searchResults.result.latLng;
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

        for(let searchResult of searchResults.result.jobs){
          // console.log(searchResult);
          this.createMarkerLocation(searchResult);
        }

        //let myPlace = new google.maps.LatLng(34.0522, -118.2437);
        //this.bounds.extend(myPlace);

        //this.marker.setMap(this.map);
        //this.map.setZoom(5);
        // map.setCenter(marker.getPosition());
        // map.panTo(marker.getPosition())
        this.map.fitBounds(this.bounds);
      })
    })
  }

  pushAccepteds(){
    this.navCtrl.push("NotificationFeedPage", { activeRole: this.role });
  }
}
