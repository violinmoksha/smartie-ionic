import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { IonicErrorHandler, AlertController } from 'ionic-angular';
import { FirebaseCrashlyticsProvider } from '../providers/firebase-crashlytics';

export { ErrorHandler, IonicErrorHandler };


@Injectable()
export class SmartieErrorHandler extends ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;
  alertCtrl: AlertController;

  constructor(injector: Injector, public crashlytics: FirebaseCrashlyticsProvider) {
    super();
  }

  handleError(err): void {
    console.log(err);
    this.crashlytics.logError(JSON.stringify(err), "Smartie Error on: " + new Date());
  }

}
