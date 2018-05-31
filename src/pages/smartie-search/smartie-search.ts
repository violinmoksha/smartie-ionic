import { IonicPage, Events, PopoverController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';
import { ParseProvider } from '../../providers/parse';
// import { Parse } from 'parse';
const Parse = require('parse');
// import * as Parse from 'parse';
import { Globalization } from '@ionic-native/globalization';

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
  private upcomingsCount: any = 0;
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

  private hasUpcomings: boolean = false;
  // TODO: autopopulate input with user's location
  // private reverseGeocodedLocation: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private storage: Storage, private smartieApi: SmartieAPI, public popoverCtrl: PopoverController, private globalization: Globalization, private ngZone: NgZone) {

    this.role = navParams.get('role');
    
    let options = {
      formatLength:'short',
      selector:'date and time'
    }
    this.globalization.getDatePattern(options).then(res => {
      console.log(res);
      this.storage.set('userTimeZone', res.timezone);
    }).catch(err => {
      console.log(err);
    })

    this.accepteds = [];
    this.fromWhere = navParams.get('fromWhere');

    // console.log(navParams.get('fromWhere'));
    // console.log(navParams.data.fromWhere);
    // console.log(navParams.get('payment'));
    // console.log(navParams.data.payment);

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
        this.role = UserProfile.profileData.role;

        // this.storage.get('registeredWithStripe').then(regdWithStripe => {
          if(this.role == 'teacher' && (UserProfile.profileData.stripeCustomer == undefined || UserProfile.profileData.stripeCustomer == '' )) {
            this.checkStripeAccount(UserProfile);
          } else {
            let Profile = new Parse.Object.extend('Profile');
            let Teacher = new Parse.Object.extend('Teacher');
            let profQuery = new Parse.Query(Profile);
            let userQuery = new Parse.Query(Parse.User);
            let teacherQuery = new Parse.Query(Teacher);

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
                    console.log("Getting into teacher credentials save");
                    teacherQuery.equalTo('profile', profile);
                    teacherQuery.first({ useMasterKey: true }).then(teacher => {
                      for(let teacherCv of this.teacherCv){
                        var parseCvFile = new Parse.File(teacherCv.name, {base64: teacherCv.data});
                        parseCvFile.save({ useMasterKey: true }).then(parseFile => {
                          let Credential = new Parse.Object.extend('Credential');
                          let cred = new Credential();
                          cred.set('profile', profile);
                          cred.set('file', parseFile);
                          cred.save({ useMasterKey: true }).then(credential => {
                            console.log(credential);
                            console.log("Credentials saved successfully..!");
                          });
                        })
                      }
                    })
                  }
                }
              })
            });
          }
        // })
      });
    }
  }

  ionViewDidEnter() {
    // send proper buttons into side-menu from here
    // since this is the first side-menu -loaded Page,
    // via SmartieApp's buttonsLoad custom Event
    console.log('test-enter');
    this.events.publish("buttonsLoad", this.role);
    // this.navCtrl.push('Test1Page');
    
    this.storage.get('UserProfile').then(profile => {
      this.role = profile.profileData.role;

        if(this.role == 'teacher' && (profile.profileData.stripeCustomer == undefined || profile.profileData.stripeCustomer == '' )) {
          this.checkStripeAccount(profile);
        } else {
          if (profile == null) {
            this.navCtrl.setRoot("LoginPage");
          } else {
            let API = this.smartieApi.getApi(
              'fetchNotifications',
              { profileId: profile.profileData.objectId, role: profile.profileData.role }
            );

            return new Promise(resolve => {
              interface Response {
                result: any
              };
              this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
                this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                  this.notifications = notifications;
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

                    //resolve all promises and if notifyCount > 0 make alert present and push to notification page
                    Promise.all([
                      this.getAllRequesteds(),
                      this.getAllAccepteds(),
                      this.getAllUpcomings()
                    ]).then(value => {
                      if(this.hasUpcomings == true) {
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
                              if(this.role !== 'teacher'){
                                this.navCtrl.parent.select(2);
                              }else{
                                this.navCtrl.parent.select(3);
                              }
                            }
                          }]
                        });
                        alert.present();
                      } else if(this.notifyCount > 0) {
                        let alert = this.alertCtrl.create({
                          title: 'Wow, check it out!',
                          subTitle: `You have ${this.notifyCount} active job request(s)! Tap OK to visit your Notifications page!`,
                          buttons: [{
                            text: 'OK',
                            handler: () => {
                              if(this.role !== 'teacher'){
                                this.navCtrl.parent.select(2);
                              }else{
                                this.navCtrl.parent.select(3);
                              }
                            }
                          }]
                        });
                        alert.present();
                      }
                    })
                  });
                })
              }, err => {
                console.log(err);
              });
            });
          }
        }
    });
  }

  ionViewDidLoad(){
    console.log('test-load');
    this.events.publish("buttonsLoad", this.role);
    /* this.storage.get('UserProfile').then(profile => {
      this.role = profile.profileData.role;

        if(this.role == 'teacher' && (profile.profileData.stripeCustomer == undefined || profile.profileData.stripeCustomer == '' )) {
          this.checkStripeAccount(profile);
        } else {
          if (profile == null) {
            this.navCtrl.setRoot("LoginPage");
          } else {
            let API = this.smartieApi.getApi(
              'fetchNotifications',
              { profileId: profile.profileData.objectId, role: profile.profileData.role }
            );

            return new Promise(resolve => {
              interface Response {
                result: any
              };
              this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
                this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                  this.notifications = notifications;
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

                    //resolve all promises and if notifyCount > 0 make alert present and push to notification page
                    Promise.all([
                      this.getAllRequesteds(),
                      this.getAllAccepteds(),
                      this.getAllUpcomings()
                    ]).then(value => {
                      if(this.hasUpcomings == true) {
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
                              if(this.role !== 'teacher'){
                                this.navCtrl.parent.select(2);
                              }else{
                                this.navCtrl.parent.select(3);
                              }
                            }
                          }]
                        });
                        alert.present();
                      } else if(this.notifyCount > 0) {
                        let alert = this.alertCtrl.create({
                          title: 'Wow, check it out!',
                          subTitle: `You have ${this.notifyCount} active job request(s)! Tap OK to visit your Notifications page!`,
                          buttons: [{
                            text: 'OK',
                            handler: () => {
                              if(this.role !== 'teacher'){
                                this.navCtrl.parent.select(2);
                              }else{
                                this.navCtrl.parent.select(3);
                              }
                            }
                          }]
                        });
                        alert.present();
                      }
                    })
                  });
                })
              }, err => {
                console.log(err);
              });
            });
          }
        }
    }); */
  }

  getAllRequesteds(){
    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getAllRequesteds',
        this.body
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        this.notifyCount = '';
        if(response.result.length > 0){
          this.notifyCount = response.result.length;
          this.storage.set("userAllRequesteds", response.result);
        }
        resolve('success');
      }, err => {
        console.log(err);
      })
    })
  }

  getAllAccepteds(){
    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getAllAccepteds',
        this.body
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        if(response.result.length > 0){
          this.notifyCount = this.notifyCount + response.result.length;
          this.storage.set("userAllAccepteds", response.result);
        }
        resolve('success');
      })
    })
  }

  getAllUpcomings(){
    return new Promise(resolve => {
      let API = this.smartieApi.getApi(
        'getAllUpcomings',
        this.body
      );
      interface Response {
        result: any;
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
        if(response.result.length > 0){
          this.hasUpcomings = true;
          this.upcomingsCount = response.result.length;
          this.notifyCount = this.notifyCount + response.result.length;
          this.storage.set("userAllUpcomings", response.result);
        }
        resolve('success');
      }, err => {
        console.log(err);
      })
    })
  }

  getGeoPoint(searchLoc){
    return new Promise(resolve => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
      'address': searchLoc
      }, function(results, status) {

        // hide actual geopoint
        let x0 = results[0].geometry.location.lng();
        let y0 = results[0].geometry.location.lat();

        // 5km rad as deg (reasonably close but not too far)
        let rd = 5000/111300, u = Math.random(), v = Math.random();
        let w = rd * Math.sqrt(u);
        let t = 2 * Math.PI * v;
        let x = w * Math.cos(t);
        let y = w * Math.sin(t);
        let xp = x/Math.cos(y0);

        let searchLocLatLng = new Parse.GeoPoint({
          latitude: y+y0,
          longitude: xp+x0
        });

        resolve(searchLocLatLng);
      });
    })
  }

  findJobsSearch(searchLoc){
    this.getGeoPoint(searchLoc).then(response => {
      this.smartieSearchResult(null, this.navParams.data.role, response);
    });
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

      this.ngZone.run(() => {
        this.initJobRequestPopUp(locationData);
      })
    });

  }

  initJobRequestPopUp(locationData){
    let params;
      if (this.role !== 'teacher') {
        params = {
          profilePhoto: locationData.teacherProfile.profilePhoto,
          profileStripeAccount: locationData.teacherProfile.stripeCustomer,
          fullname: locationData.teacherProfile.fullname,
          role: locationData.teacherProfile.role,
          prefPayRate: locationData.teacherProfile.prefPayRate,
          yrsExperience: locationData.teacher.yrsExperience,
          profileAbout: locationData.teacherProfile.profileAbout,
          profileTitle: locationData.teacherProfile.profileTitle,
          prefLocation: locationData.teacherProfile.prefLocation,
          phone: locationData.teacherProfile.phone,
          teacherProfileId: locationData.teacherProfile.objectId,
          loggedRole: this.role,
          defaultStartDate: locationData.teacher.defaultStartDate,
          defaultEndDate: locationData.teacher.defaultEndDate,
          defaultStartTime: locationData.teacher.defaultStartTime,
          defaultEndTime: locationData.teacher.defaultEndTime,
          hasUpcomings: this.hasUpcomings
        };
      } else {
        params = {
          profilePhoto: locationData.otherProfile.profilePhoto,
          profileStripeAccount: locationData.otherProfile.stripeCustomer,
          fullname: locationData.otherProfile.fullname,
          role: locationData.otherProfile.role,
          profileAbout: locationData.otherProfile.profileAbout,
          profileTitle: locationData.otherProfile.profileTitle,
          prefPayRate: locationData.otherProfile.prefPayRate,
          prefLocation: locationData.otherProfile.prefLocation,
          phone: locationData.otherProfile.phone,
          otherProfileId: locationData.otherProfile.objectId,
          loggedRole: this.role,
          hasUpcomings: this.hasUpcomings
        }
      }
      let popover = this.popoverCtrl.create("JobRequestPage", { params: params });
      popover.present();
      //this.navCtrl.push("JobRequestPage", { params: params });
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
      // TODO: this now needs to do a quick geocoder call (fixed)
      mapCenter = searchLoc;
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
    if(this.role !== 'teacher'){
      this.navCtrl.parent.select(2);
    }else{
      this.navCtrl.parent.select(3);
    }
  }

  checkStripeAccount(profile){
      let alert = this.alertCtrl.create({
        title: 'Time to add your Stripe Account!',
        subTitle: `You must add a Stripe Account in order to receive payments from students! We will send you to Payment Details now in order to gather your information.`,
        enableBackdropDismiss: false,
        buttons: [{
          text: 'OK',
          handler: () => {
            // this.navCtrl.push('NotificationFeedPage');
            this.navCtrl.parent.select(1);
          }
        }]
      });
      alert.present();
  }
}
