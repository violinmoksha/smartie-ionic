import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../app/app.constants';

/*
  Generated class for the SmartieApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmartieApiProvider {
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;

  getApiKeys(endPoint){
    if(Constants.API_ENDPOINTS.env === 'local'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.local;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'test'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.test;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.prod;
      this.applicationId = Constants.API_ENDPOINTS.headers.prod.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.prod.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.prod.contentType;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': this.applicationId,
        'X-Parse-Master-Key': this.masterKey,
        'Content-Type': this.contentType
      })
    };

    return { apiUrl: this.baseUrl + Constants.API_ENDPOINTS.paths.fn + '/' + endPoint, apiHeaders: httpOptions }

  }

  constructor(public http: HttpClient) {
    console.log('Hello SmartieApiProvider Provider');
  }

}
