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
  private parseAppId: string = "948b9456-8c0a-4755-9e84-71be3723d338";
  private parseServerUrl: string = "https://test.t0tl3s.com/parse";

  constructor() {
    this.parseInitialize();
    console.log('Initiated Parse');
  }

  parseInitialize(){
    Parse.initialize(this.parseAppId);
    Parse.serverURL = this.parseServerUrl;
  }

}
