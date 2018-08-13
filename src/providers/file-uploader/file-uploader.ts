import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'q';
const Parse = require('parse');
/*
  Generated class for the FileUploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileUploaderProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FileUploaderProvider Provider');
  }

  uploadFile(file, format) {
    return new Promise((resolve, reject) => {
      console.log(file);
      let parseFile = new Parse.File(file.name+'.'+format, { base64: file.data });
      parseFile.save().then((fileResult) => {
        resolve(fileResult);
      }, (err) => {
        reject(err);
      });
    });
  }

  saveToCredentialClass(profile, fileUrl) {
    let Credential = new Parse.Object.extend('Credential');
    let cred = new Credential();
    cred.set('profile', profile);
    cred.set('file', fileUrl);
    cred.save({ useMasterKey: true }).then(credential => {
      console.log(credential);
      console.log("Credentials saved successfully..!");
    }).fail((e) => {
      console.log(e);
    });
  }

}
