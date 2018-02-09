import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';

/*
  Generated class for the SmartieAPI provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmartieAPI {
  private baseUrl: string;
  private applicationId: string;
  private contentType: string;

  constructor(public http: HttpClient) {
  }

  getApi(endPoint, body){
    const ourBaseUrls = Constants.API_ENDPOINTS.baseUrls;
    const ourHeaders = Constants.API_ENDPOINTS.headers;
    const ourEnv = Constants.API_ENDPOINTS.env;

    if(ourEnv === 'local' || ourEnv === 'test'){
      (ourEnv === 'test') ?
        this.baseUrl = ourBaseUrls.test :
        this.baseUrl = ourBaseUrls.local;
      this.applicationId = ourHeaders.localAndTest.applicationId;
    } else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = ourBaseUrls.prod;
      this.applicationId = ourHeaders.prod.applicationId;
    }
    this.contentType = 'application/json';

    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'Content-Type': this.contentType
      })
    };

    return { apiUrl: this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint, apiBody: JSON.stringify(body), apiHeaders: httpOptions }
  }
}
