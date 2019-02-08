import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../app/app.data';
/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient, private storage: Storage, private dataService: DataService) {
    console.log('Hello UtilsProvider Provider');
  }

  getSelectedCity() {
    console.log("fetching city name");
    return new Promise((resolve, reject) => {
      this.storage.get("UserProfile").then(user => {
        if(user && user.profileData){
          this.dataService.getApi("getCityByLatlng", {latlng:[user.profileData.latlng.latitude, user.profileData.latlng.longitude]}).then(API => {
              this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(resp => {
                console.log(resp);
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

}
