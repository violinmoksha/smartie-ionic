import { Injectable } from '@angular/core';
import { Crashlytics } from '@ionic-native/fabric';
import { Platform } from 'ionic-angular';
/*
  Generated class for the FirebaseCrashlyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseCrashlyticsProvider {
  
  constructor(public crashlytics: Crashlytics, public platform: Platform) {
    console.log('Hello FirebaseCrashlyticsProvider Provider');
  }

  forceCrash() {
    this.crashlytics.addLog("hehey Smartie Crash Test!!!");
    this.crashlytics.sendCrash();
  }

  logError(e, msg) {
    this.crashlytics.addLog(msg);
    if (this.platform.is('android'))
    this.crashlytics.sendNonFatalCrash(e);
    else if (this.platform.is("ios"))
    this.crashlytics.recordError(e, -1);
  }

  setUserInfo(user) {
    this.crashlytics.setUserIdentifier(user.objectId);
    this.crashlytics.setUserName(user.fullname);
  }

}
