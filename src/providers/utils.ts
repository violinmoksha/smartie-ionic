import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../app/app.data';
import { LoadingController } from 'ionic-angular';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient, private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, public themeableBrowser: ThemeableBrowser,) {
  }

  getSelectedCity() {
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(user => {
        if(user && user.profileData){
          this.dataService.getApi("getCityByLatlng", {latlng:[user.profileData.latlng.latitude, user.profileData.latlng.longitude]}).then(API => {
              this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
                if(resp.result){
                  for (var i=0; i<resp.result.address_components.length; i++) {
                    if(resp.result.address_components[i].types[0] == 'locality'){
                      user.profileData.cityName = resp.result.address_components[i].long_name;
                      this.storage.set("UserProfile", user);
                      resolve(resp.result.address_components[i].long_name);
                    }
                  }
                } else {
                  resolve(user.profileData.prefLocation);
                }
              })
          })
        } else {
          reject("Error: No user found");
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

}
