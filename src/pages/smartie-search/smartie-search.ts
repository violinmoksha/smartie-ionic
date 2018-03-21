import { IonicPage, Events, PopoverController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
//import { ParseProvider } from '../../providers/parse';
import { Parse } from 'parse';

declare var google;

/**
 * Generated class for the SmartieSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
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
  private notifyCount: any = 0;
  private latLngUser: any;
  private marker: any;
  private body: any;
  private profilePhotoData: any;
  private schoolPhotoDataUrl: any;
  private teacherCv: any;
  //private searchData: any;
  //private alertOpts: any;
  // private infoWindow: any;

  public notifications: any;
  public accepteds: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private storage: Storage, private smartieApi: SmartieAPI, public popoverCtrl: PopoverController ) {
    this.role = navParams.data.role;
    this.accepteds = [];
    this.fromWhere = navParams.data.fromWhere;
    this.notifications = navParams.data.notifications;
    if (this.fromWhere == 'signUp') {
      // TODO: retrieve the profilePhoto and CVs from
      // this.storage HERE if we came from signUp,
      this.storage.get('profilePhotoDataUrl').then(profilePhotoData => {
        this.profilePhotoData = profilePhotoData;
      });
      this.storage.get('schoolPhotoDataUrl').then(schoolPhotoDataUrl => {
        this.schoolPhotoDataUrl = schoolPhotoDataUrl;
      });
      this.storage.get('teacherCreds').then(teacherCreds => {
        this.teacherCv = teacherCreds;
        console.log(this.teacherCv);
      });
      console.log('We are here.');
      this.storage.get('UserProfile').then(UserProfile => {
        console.log(UserProfile);
        let Profile = new Parse.Object.extend('Profile');
        let profQuery = new Parse.Query(Profile);
        let userQuery = new Parse.Query(Parse.User);

        userQuery.equalTo('username', UserProfile.userData.username);
        userQuery.first({useMasterKey:true}).then(user => {
          console.log('Got the user');
          profQuery.equalTo('user', user);
          profQuery.first({useMasterKey:true}).then(profile => {
            console.log('Got the profile');
            if(this.profilePhotoData){
              let parseFile = new Parse.File('photo.jpg', { base64: this.profilePhotoData });
              console.log('trying to save the file');
              parseFile.save({ useMasterKey: true }).then(file => {
                console.log('Saved the file');
                profile.set('profilePhoto', file);
                profile.save({ useMasterKey:true }).then(profile => {
                  if(this.role == 'school'){
                    if(this.schoolPhotoDataUrl){
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
            //setting teacher Credentials
            if(this.role == 'teacher'){
              if(this.teacherCv){
                for(let teacherCv of this.teacherCv){
                  var parseCvFile = new Parse.File(teacherCv.name, {base64: teacherCv.data});
                  parseCvFile.save({ useMasterKey: true }).then(parseFile => {
                    console.log(parseFile);
                    let Credential = new Parse.Object.extend('Credential');
                    let cred = new Credential();
                    // cred.set('teacher', teacher);
                    // cred.set('profile', profile);
                    cred.set('file', parseFile);
                    cred.save({ useMasterKey: true });
                  })
                }
              }
            }
          })
        });
      });
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
      // console.log(JSON.stringify(profile));
      if (profile == null) {
        this.navCtrl.setRoot("LoginPage");
      } else {
        this.storage.get('phoneLatLng').then(phoneLatLng => {
          //console.log(phoneLatLng);
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

          return new Promise(resolve => {
            let API = this.smartieApi.getApi(
              'getAllRequesteds',
              this.body
            );
            interface Response {
              result: any;
            };
            this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
              if(response.result.length > 0){
                this.notifyCount = response.result.length;
                this.storage.set("userAllRequesteds", response.result);
              }
            }, err => {
              console.log(err);
            })

            //get AllAccepted Here
            API = this.smartieApi.getApi(
              'getAllAccepteds',
              this.body
            );
            interface Response {
              result: any;
            };
            this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
              this.notifyCount = this.notifyCount + response.result.length;
              this.storage.set("userAllAccepteds", response.result);
            })
          })
        });
      }
    });
  }

  findJobsSearch(searchLoc){
    this.smartieSearchResult(null, this.navParams.data.role, searchLoc);
  }

  createMarkerLocation(locationData){
    // TODO: there shud be a way to wrap this
    // so we don't need to include the frontend
    // SDK directly in our index.html
    // console.log(locationData);
    let latLng;
    if (this.role == 'teacher') {
      latLng = new google.maps.LatLng(locationData.otherProfile.latlng.latitude, locationData.otherProfile.latlng.longitude);
    } else {
      latLng = new google.maps.LatLng(locationData.teacherProfile.latlng.latitude, locationData.teacherProfile.latlng.longitude);
    }

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
          prefLocation: locationData.teacherProfile.prefLocation,
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
          prefPayRate: locationData.otherProfile.prefPayRate,
          prefLocation: locationData.otherProfile.prefLocation,
          phone: locationData.otherProfile.phone,
          otherProfileId: locationData.otherProfile.objectId,
          loggedRole: this.role
        }
      }
      let popover = this.popoverCtrl.create("JobRequestPage", { params: params });
      popover.present();
      //this.navCtrl.push("JobRequestPage", { params: params });
    });

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
