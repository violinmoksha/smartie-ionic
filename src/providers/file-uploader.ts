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
  fileTransfer:FileTransferObject;
  public awsBucket;
  constructor(private transfer: FileTransfer, public dataService: DataService) {
    this.fileTransfer = this.transfer.create();
    this.awsBucket = {"feedback":"Feedbacks", "credential":"Credentials", "profile":"Profile", "drivingLicense": "DrivingLicense"}
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

  uploadFileToAWS(filePath) {
    //let file = filePath.substr(0, filePath.lastIndexOf('/'));
    console.log(filePath);
    return new Promise((resolve, reject) => {
      let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);

      console.log('Going in with fileName: '+fileName);
      this.dataService.getApi('getAWSCredential', { 'fileName': fileName }).then(async API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async (signedUrl) => {
          let options: FileUploadOptions = {
            fileKey: fileName,
            fileName: fileName,
            chunkedMode: false,
            mimeType: "image/jpeg",
            httpMethod:'PUT',
            headers: {}
          }
         console.log('Going in with signedUrl of: '+signedUrl.result);
         this.fileTransfer.upload(filePath, signedUrl.result, options).then(data => {
              console.log("FileUpload");
              console.log(data);
              //let filePath = signedUrl.result.split('?')[0];
              resolve(signedUrl.result);
            }, (err) => {
              console.log(err);
              reject(err);
            })
        }, (err) => {
          console.log(err);
          reject(err);
        })
      });
    })
  }

  saveToCredentialClass(profile, fileUrl) {
    return new Promise((resolve, reject)=>{
      let Credential = Parse.Object.extend('Credential');
      let cred = new Credential();
      cred.set('profile', profile);
      cred.set('file', fileUrl);
      cred.save({ useMasterKey: true }).then(credential => {
        resolve(credential);
      }).fail((e) => {
        console.log(e);
        reject(e);
      });
    })
  }

}
