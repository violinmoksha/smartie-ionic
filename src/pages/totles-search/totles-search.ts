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
  //private alertOpts: any;
  // private infoWindow: any;

  private alertCtrl: AlertController;

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private sanitizer: DomSanitizer, public modalCtrl: ModalController) {
    this.role = navParams.data.role;
    this.fromWhere = navParams.data.fromWhere;
    this.alert = this.alertCtrl;
    if(localStorage.getItem(navParams.data.loggedProfileId+'notificationCount')){
      this.notifyCount = JSON.parse(localStorage.getItem(navParams.data.loggedProfileId+'notificationCount')).result;
    }
  }

  ionViewDidLoad(){
    let latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profile.latlng;
    this.totlesSearchResult(latLngUser, this.navParams.data.role);
    // this.initMap();
  }

  initMap(){
    let latLngUser = JSON.parse(localStorage.getItem(this.role+'UserProfile')).profile.latlng;
    this.totlesSearchResult(latLngUser, this.navParams.data.role);
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

    if(locationData.expertlangs){
      this.expertlang = locationData.expertlangs.join();
    }

    // this.infoWindow = new google.maps.InfoWindow({
    //   content: this._contentTitle + this._contentMessage
    // });

    marker.addListener('click', ()=> {

      let profileModal = this.modalCtrl.create(JobRequests,
        {
          profilePhoto: this.profilePhoto,
          fullname: locationData.fullname,
          role: locationData.role,
          prefPayRate: locationData.prefpayrate,
          experience: locationData.yrsexperience,
          expertLangs: this.expertlang,
          profileAbout: locationData.profileabout,
          prefLocation: locationData.preflocation,
          phone: locationData.phone,
          requestedId: locationData.profileId,
          loggedRole: this.role,
        },
        {
          cssClass: 'totles-search-alert'
        }
      );
      profileModal.present();

    });

    marker.setMap(this.map);
    this.map.setZoom(4);
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

  totlesSearchResult(latLng, searchRole){

    let searchData = { latlng: latLng, role: searchRole };

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
