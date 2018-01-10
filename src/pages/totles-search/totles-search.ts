import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { DomSanitizer } from '@angular/platform-browser';
import { JobRequests } from '../job-requests/job-requests';
import { AllAccepteds } from '../all-accepteds/all-accepteds';

declare var google;

/**
 * Generated class for the TotlesSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
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
  private expertlang: string;
  private alert: any;
  private notifyCount: any;
  private latLngUser: any;
  private searchLogo:string = './assets/img/smartie-horzontal-logo.png';
  //private alertOpts: any;
  // private infoWindow: any;

  private alertCtrl: AlertController;

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private sanitizer: DomSanitizer, public modalCtrl: ModalController) {
    this.role = navParams.data.role;
    this.fromWhere = navParams.data.fromwhere;
    this.alert = this.alertCtrl;
    if(localStorage.getItem(navParams.data.loggedProfileId+'notificationCount')){
      this.notifyCount = JSON.parse(localStorage.getItem(navParams.data.loggedProfileId+'notificationCount')).result;
    }
  }

  ionViewDidLoad(){
    // console.log(this.fromWhere);
    if(this.fromWhere == 'signUp'){
      this.latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profile.latlng;
    }else{
      this.latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profileData.latlng;
    }
    this.totlesSearchResult(this.latLngUser, this.navParams.data.role, null);
    // this.initMap();
  }

  findJobsSearch(searchLoc){
    this.totlesSearchResult(null, this.navParams.data.role, searchLoc);
  }

  initMap(){
    let latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profileData.latlng;
    this.totlesSearchResult(latLngUser, this.navParams.data.role, null);
  }


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

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      // position: latLng
      position: latLng,
      icon: this.userIcon
    });
    this.bounds.extend(latLng);

    if(locationData.profilephoto){
      this.profilePhoto = locationData.profilephoto.url;
    }else{
      this.profilePhoto = './assets/img/user-round-icon.png';
    }

    this.expertlang = locationData.expertlangs;

    marker.addListener('click', ()=> {

      let profileModal = this.modalCtrl.create(JobRequests,
        {
          profilePhoto: this.profilePhoto,
          fullname: locationData.fullname,
          role: locationData.role,
          prefPayRate: locationData.prefpayrate,
          prefCurrency: locationData.prefcurrency,
          experience: locationData.yrsexperience,
          expertLangs: locationData.expertlangs,
          profileAbout: locationData.profileabout,
          prefLocation: locationData.preflocation,
          phone: locationData.phone,
          requestedId: locationData.profileId,
          loggedRole: this.role,
          defStartDate: locationData.defstartdate,
          defEndDate: locationData.defenddate,
          defStartTime: locationData.defstarttime,
          defEndTime: locationData.defendtime,
        },
        {
          cssClass: 'totles-search-alert ' + this.role
        }
      );
      profileModal.present();

    });

    marker.setMap(this.map);
    this.map.setZoom(5);
    // map.setCenter(marker.getPosition());
    // map.panTo(marker.getPosition())
    this.map.fitBounds(this.bounds);
  }

  public contentTitle() {
    return this.sanitizer.bypassSecurityTrustHtml(this._contentTitle);
  }
  public contentMessage() {
    return this.sanitizer.bypassSecurityTrustHtml(this._contentMessage);
  }

  totlesSearchResult(latLng, searchRole, searchLoc){
    let searchData;
    if(latLng !== null){
      searchData = { latlng: latLng, role: searchRole };
    }else if(searchLoc !== null){
      searchData = { role: searchRole, searchloc: searchLoc };
    }

    // let searchData = { latlng: latLng, role: searchRole };

    let API = this.smartieApi.getApi(
      'totlesSearch',
      searchData
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(searchResults => {
        var mapOptions = {
            zoom: 1,
            // center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.bounds = new google.maps.LatLngBounds();

        for(let searchResult of searchResults.result){
          this.createMarkerLocation(searchResult);
        }
      })
    })
  }

  pushAccepteds(){
    this.navCtrl.push(AllAccepteds, { activeRole: this.role });
  }
}
