import { Injectable } from '@angular/core';
import { Parse } from 'parse';
import 'rxjs/add/operator/map';

/*
  Generated class for the ParseProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ParseProvider {
  private parseAppId: string = "80f6c155-d26e-4c23-a96b-007cb4cba8e1";
  private parseServerUrl: string = "https://smartieapp.com/parse";

  constructor() {
    this.parseInitialize();
    console.log('Initiated Parse');
  }

  parseInitialize(){
    Parse.initialize(this.parseAppId);
    Parse.serverURL = this.parseServerUrl;
  }

}
