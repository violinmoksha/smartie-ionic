import { env as ENV } from '../envs/env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../app/app.data';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AppRate } from '@ionic-native/app-rate';
/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  public jobTimer:any = null;
  public badgeLevel = [{name:"Newbie", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FNewbie.png?alt=media&token=e2a5f05a-afce-4def-abd3-8a899b64ed52"},
                  {name:"Excellent", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2Fexcellent.png?alt=media&token=2cfe1da8-2d07-4c1f-9698-759f9e46397a"},
                  {name:"JuniorTeacher", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FJunior-Teacher.png?alt=media&token=668933ab-c40e-4859-9828-8b972b266750"},
                  {name:"Explorer", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FExplorer.png?alt=media&token=d554d0c0-8a9e-48c1-a2cc-3b1643a96a70"},
                  {name:"Acheiver", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FAchiver.png?alt=media&token=009e05df-ff81-4b45-8ea8-efacaed66311"},
                  {name:"Wizard", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2Fwizard.png?alt=media&token=ceaa0e6d-efb6-49cb-b319-9245d5c45fcf"},
                  {name:"Sage", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2Fsage.png?alt=media&token=6e1428a7-4d2e-4a55-8833-a2a69cc360b5"},
                  {name:"Guru", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2Fguru.png?alt=media&token=61885284-ed38-4812-a2d7-8c2ab590fdd4"},
                  {name:"Master", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FMaster.png?alt=media&token=bb36da6b-2da1-434b-b2e4-3a35dea3e65c"},
                  {name:"Yoda", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FYoda.png?alt=media&token=d5e75182-46f3-4b8e-a0da-33b824e38d18"}];

public studentBadgeLevel = [
                  {name:"Newbie", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/Badge%2FNewbie.png?alt=media&token=e2a5f05a-afce-4def-abd3-8a899b64ed52"},
                  {name:"Awarding", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FAwarding.png?alt=media&token=13afa180-ac23-4e5d-bd3d-ea5dcf5e0eda"},
                  {name:"Excellent", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FExcellent.png?alt=media&token=8d3fa6c6-bfd9-43d5-a82b-1e8bc9737fd2"},
                  {name:"Gracious", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FGracious.png?alt=media&token=5f906020-966c-4d37-ac69-0519106a16f4"},
                  {name:"Robin-Hood", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FRobin-Hood.png?alt=media&token=94add481-ffdc-4c91-8862-d23e5e7199a2"},
                  {name:"Kind", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FKind.png?alt=media&token=b3d4f145-9dfa-47bf-bb72-589c1d242196"},
                  {name:"Generous", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FGenerous.png?alt=media&token=c2a632d9-2243-429a-99c1-57f655ed38c4"},
                  {name:"Considerate", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FConsiderate.png?alt=media&token=ae984490-c037-4262-b7d3-b7e0f5d5ea1e"},
                  {name:"Benevolent", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FBenevolent.png?alt=media&token=a9ccc822-342b-42fb-8493-1701342051b1"},
                  {name:"Noble", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FNoble.png?alt=media&token=5a4ed2d6-267f-4aa4-80f8-d79e44d5da94"},
                  {name:"Compassionate", badgeUrl:"https://firebasestorage.googleapis.com/v0/b/smartie-212716.appspot.com/o/StudentBadges%2FCompassionate.png?alt=media&token=72509d22-84ae-4007-a2f6-c8d14f24224b"}];
  constructor(public http: HttpClient, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, public themeableBrowser: ThemeableBrowser, public geoService: Geolocation, public locationService:LocationAccuracy, private appRate: AppRate) {
  }

  getSelectedCity() {
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(user => {
        if(user && user.profileData){
        this.getGeoCodeData(user.profileData.latlng.latitude, user.profileData.latlng.longitude).then((result: any) => {
                  console.log(result)
                  if(result){
                    for (var i=0; i<result.address_components.length; i++) {
                      if(result.address_components[i].types[0] == 'locality'){
                        user.profileData.cityName = result.address_components[i].long_name;
                        this.storage.set("UserProfile", user);
                        resolve(result.address_components[i].long_name);
                      }
                    }
                  } else {
                    resolve(user.profileData.prefLocation);
                  }
        }, err => {
          reject(err);
        })
      } else {
        reject("Error: No user found");
      }
      })
    })
  }

  getGeoCodeData(lat, lng) {
    return new Promise((resolve, reject) => {
      this.dataService.getApi("getCityByLatlng", {latlng:[lat, lng]}).then(API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
            console.log(resp);
            if(resp.result){
              resolve(resp.result)
            } else {
              reject(resp);
            }
          }, err => {
            reject(err);
          })
      })
    })
  }

  checkCountryCodeToBlock() {
    return new Promise((resolve, reject) => {
      this.checkLocationService().then(success => {
        this.geoService.getCurrentPosition().then(location => {
          console.log(location);
          this.getGeoCodeData(location.coords.latitude, location.coords.longitude).then((result: any) => {
            console.log(result);
            if(result.address_components.length>0){
              for (var i=0; i<result.address_components.length; i++) {
                if(result.address_components[i].types[0] == 'country'){
                  if(result.address_components[i].short_name == ENV.EXEC_COUNTRY) {
                    resolve(true);
                  } else {
                    resolve(false);
                    console.log("Blocking Access, Not US");
                  }
                }
              }
            } else {
              reject("checkCountryCodeToBlock: No results from geo code data");
            }
          }, err => {
            reject(err);
          });
        });
      }, err => {
        console.log(err);
      })
    });
  }

  jobReqTimer(userData = null,classContext, callBack) {
    clearInterval(this.jobTimer);
    this.jobTimer = setInterval(()=> {
      if(callBack){
        callBack(userData, classContext);
      }
    }, 60000)
  }

  clearJobTimer() {
    clearInterval(this.jobTimer);
    this.jobTimer = null;
  }

  checkLocationService() {
    return new Promise((resolve, reject) => {
      this.locationService.canRequest().then(canRequest => {
        if(canRequest){
          this.locationService.request(this.locationService.REQUEST_PRIORITY_HIGH_ACCURACY).then(()=>{
              resolve(true);
          }, err => {
            reject(err);
          })
        } else {
          resolve(false);
        }
      })
    })
  }

  updateFcmStatus(deviceId, status){
    return new Promise(async(resolve, reject) => {
        return await this.dataService.getApi(
          'updateFcmStatus',
          { deviceId: deviceId, status: status},
        ).then(async API => {
          return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(fcm => {
            resolve(fcm);
          }, err => {
            reject(err);
          })
        })
      });
  }

  getCurrentUserData(){
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(currentUserData => {
        resolve(currentUserData);
      }, err => {
        reject(err);
      })
    })
  }

  openStripeDashboard() {
    this.storage.get("UserProfile").then(user => {
      if (user.profileData) {
        var stripeCustomerId = user.profileData.stripeCustomer.stripe_user_id;
        let loading = this.loadingCtrl.create({
          content: 'Creating Stripe Account...'
        });
        loading.present();

        this.dataService.getApi(
          'createStripeLoginLink',
          { stripeAccountId: stripeCustomerId }
        ).then(async API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
            loading.dismiss();
            if (response.result.url) { // ??? NB: everything is usually response.data.result now FYI using @ionic-native/http
              const options: ThemeableBrowserOptions = {
                toolbar: {
                  height: 44,
                  color: '#00BA63'
                },
                title: {
                  color: '#ffffff',
                  showPageTitle: true,
                  staticText: "Payment Details"
                },
                closeButton: {
                  wwwImage: 'assets/imgs/close-white.png',
                  wwwImagePressed: 'assets/imgs/close-white.png',
                  align: 'left',
                  event: 'closePressed'
                },
                backButtonCanClose: true
              }
              setTimeout(()=>{
                this.themeableBrowser.create(response.result.url, '_blank', options);
              },500);
            }
            // may need to return here for Tests???
          }, err => {
            console.log(err);
            return err;
          });
        });
      }
    })
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

  initAppRating() {
    console.log("## Coming app rating function ##");

    this.appRate.preferences = {
        simpleMode: true,
        displayAppName: 'Smartie App',
        usesUntilPrompt: 2,
        promptAgainForEachNewVersion: false,
        storeAppURL: {
          android: 'market://details?id=io.ionic.smartie'
        },
        useLanguage: 'en',
        customLocale: {
          title: 'Do you enjoy %@?',
          message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!',
          cancelButtonLabel: 'No, Thanks',
          laterButtonLabel: 'Remind Me Later',
          rateButtonLabel: 'Rate It Now',
        },
        callbacks: {
          onRateDialogShow: function(callback){
            console.log('rate dialog shown!');
          },
          onButtonClicked: function(buttonIndex){
            console.log('Selected index: -> ' + buttonIndex);
          }
        }
      };

      // Opens the rating immediately no matter what preferences you set
      this.appRate.promptForRating(true);
  }

  getProfLevelByActive(activeLevel, role){
    let badgeData = role == 'teacher' ? this.badgeLevel:this.studentBadgeLevel;
    let badges = {};
    console.log("Searching lelves", badgeData);
    for (var i=0; i<badgeData.length;i++) {
      console.log(badgeData[i]);
    if (badgeData[i].name == activeLevel) {
      if(i==1)
      badges = {"prev":null, "next":badgeData[i+1]};
      else
      badges = {"prev":badgeData[i-1], "next":badgeData[i+1]};

      console.log("Matched levels", badges);
    }
  }
  return badges;
  }

  getTimeString(date) {//this function converts date to lacal time string. eg. 10:00 AM
    var dt = new Date(date);
    var time = dt.toLocaleTimeString();
    time = time.replace(/\u200E/g, '');
    time = time.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
    return time;
  }
}
