import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { DataService } from '../app/app.data';

import Parse from 'parse';

/*
  Generated class for the FileUploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileUploaderProvider {
  fileTransfer:FileTransferObject
  constructor(public http: HttpClient, private transfer: FileTransfer, public dataService: DataService) {
    console.log('Hello FileUploaderProvider Provider');
    this.fileTransfer = this.transfer.create();
  }

  uploadFile(file, format) {
    return new Promise((resolve, reject) => {
      let parseFile = new Parse.File(file.name+'.'+format, { base64: file.data });
      parseFile.save().then((fileResult) => {
        resolve(fileResult);
      }, (err) => {
        reject(err);
      });
    });
  }

  async uploadFileToAWS(filePath) {
    //let file = filePath.substr(0, filePath.lastIndexOf('/'));
    let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);

    return await this.dataService.getApi('getAWSCredential', { 'fileName': fileName }).then(async API => {
      return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(async (data) => {
        console.log(data);
        let params = {
          "key": fileName,
          "AWSAccessKeyId": data[0].result.awsKey,
          "acl": "public-read",
          "policy": data[0].result.policy,
          "signature": data[0].result.signature,
          "Content-Type": "image/jpeg"
        }
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: fileName,
          chunkedMode: false,
          mimeType: "image/jpeg",
          params: params,
        }

        return await this.fileTransfer.upload(filePath, "https://smartiebucket.s3.amazonaws.com/", options)
          .then(async (data) => {
            console.log(data);
            return await data;
            // success
          }, async (err) => {
            console.log(err);
            return await err;
            // error
          })
      }, async (err) => {
        console.log(err);
        return await err;
      })
    });
  }

  saveToCredentialClass(profile, fileUrl) {
    let Credential = Parse.Object.extend('Credential');
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
