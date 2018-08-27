import { Pro } from '@ionic/pro';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

export { ErrorHandler, IonicErrorHandler };

// TODO delete this one in prod
/*
const IonicPro = Pro.init('APP_ID', {
  appVersion: "0.0.1"
});
*/

// TODO uncomment this one for emails of errs in prod
const IonicPro = Pro.init('51a6d7d8', {
  appVersion: "0.0.1"
});

@Injectable()
export class SmartieErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    //IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    console.info('App handleError() triggered.');
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}
