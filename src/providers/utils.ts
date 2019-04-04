import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../app/app.data';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  public jobTimer:any = null;

  constructor(public http: HttpClient, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, public themeableBrowser: ThemeableBrowser, public geoService: Geolocation, public locationService:LocationAccuracy) {
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
                  if(result.address_components[i].short_name == 'IN') {
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
                const browser: ThemeableBrowserObject = this.themeableBrowser.create(response.result.url, '_blank', options);
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
}
