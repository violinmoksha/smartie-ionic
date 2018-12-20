import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crashlytics } from '@ionic-native/fabric';
/*
  Generated class for the FirebaseCrashlyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseCrashlyticsProvider {
  
  constructor(public crashlytics: Crashlytics) {
    console.log('Hello FirebaseCrashlyticsProvider Provider');
  }

  forceCrash() {
    this.crashlytics.addLog("hehey Smartie Crash Test!!!");
    this.crashlytics.sendCrash();
  }

  logError(e, msg) {
    this.crashlytics.addLog(msg);
    this.crashlytics.sendNonFatalCrash(e);
  }

  setUserInfo(user) {
    this.crashlytics.setUserIdentifier(user.objectId);
    this.crashlytics.setUserName(user.fullname);
  }



}
