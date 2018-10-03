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
  constructor(private transfer: FileTransfer, public dataService: DataService) {
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
      this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async (res) => {
        let params = {
          "key": fileName,
          "AWSAccessKeyId": res.result.awsKey,
          "acl": "public-read",
          "policy": res.result.policy,
          "signature": res.result.signature,
          "Content-Type": "image/jpeg"
        }
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: fileName,
          chunkedMode: false,
          mimeType: "image/jpeg",
          params: params,
        }

       this.fileTransfer.upload(filePath, "https://smartiebucket.s3.amazonaws.com/", options)
          .then(async (data) => {
            console.log(data);
            return data;
            // success
          }, async (err) => {
            console.log(err);
            return err;
            // error
          })
      }, async (err) => {
        console.log(err);
        return err;
      })
    });
  }

  saveToCredentialClass(profile, fileUrl) {
    return new Promise((resolve, reject)=>{
      let Credential = Parse.Object.extend('Credential');
      let cred = new Credential();
      cred.set('profile', profile);
      cred.set('file', fileUrl);
      cred.save({ useMasterKey: true }).then(credential => {
        resolve(credential);
        console.log(credential);
        console.log("Credentials saved successfully..!");
      }).fail((e) => {
        console.log(e);
        reject(e);
      });
    })
  }

}
