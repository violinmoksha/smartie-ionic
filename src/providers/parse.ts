import { Injectable } from '@angular/core';
// import { Parse } from 'parse';
const Parse = require('parse');
import 'rxjs/add/operator/map';

/*
  Generated class for the ParseProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ParseProvider {
  //private parseAppId: string = "80f6c155-d26e-4c23-a96b-007cb4cba8e1";
  private parseAppId: string = "948b9456-8c0a-4755-9e84-71be3723d338";
  private parseMasterKey: string = "49bc1a33-dfe7-4a32-bdcc-ee30b7ed8447"; // local and test
  //private parseServerUrl: string = "https://smartieapp.com/parse";
  private parseServerUrl: string = "https://test.t0tl3s.com/parse";
  // private parseServerUrl: string = "http://172.16.1.179:1337/parse";
  // private parseServerUrl: string = "http://76.170.58.147:1337/parse";

  constructor() {
    this.parseInitialize();
    console.log('Initiated Parse');
  }

  parseInitialize(){
    Parse._initialize(this.parseAppId, null, this.parseMasterKey);
    Parse.serverURL = this.parseServerUrl;
  }

}
