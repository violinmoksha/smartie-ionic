import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {

  constructor(public firebase:Firebase) {
    console.log('Hello AnalyticsProvider Provider');
  }

  async setScreenName(name){
    this.firebase.setScreenName(name);
  }

  getAnalyticEvent(eventName, eventAction){
    return {title:eventName, attributes:{action:eventAction}};
  }

  async addEvent(event) {
    this.firebase.logEvent(event.title, event.attributes);
  }

  async addUserProperty(){
    this.firebase.setUserProperty("role", "test");
  }

}
