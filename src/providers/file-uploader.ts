// import { Constants } from '../../app/app.constants';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
// import { resolve } from 'q';
// import { SmartieAPI } from '../../providers/api/smartie';
// const Parse = require('parse');
// /*
//   Generated class for the FileUploaderProvider provider.
//
//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class FileUploaderProvider {
//   fileTransfer:FileTransferObject
//   constructor(public http: HttpClient,private transfer: FileTransfer, private file: File,public smartieApi: SmartieAPI, private appConfig :Constants) {
//     console.log('Hello FileUploaderProvider Provider');
//     this.fileTransfer = this.transfer.create();
//   }
//
//   uploadFile(file, format) {
//     return new Promise((resolve, reject) => {
//       let parseFile = new Parse.File(file.name+'.'+format, { base64: file.data });
//       parseFile.save().then((fileResult) => {
//         resolve(fileResult);
//       }, (err) => {
//         reject(err);
//       });
//     });
//   }
//
//   async uploadFileToAWS(filePath) {
//     let file = filePath.substr(0, filePath.lastIndexOf('/'));
//     let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
//
//     let API = await this.smartieApi.getApi('getAWSCredential', { 'fileName': fileName });
//     this.smartieApi.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then((data) => {
//       console.log(data);
//       let params = {
//         "key": fileName,
//         "AWSAccessKeyId": data[0].result.awsKey,
//         "acl": "public-read",
//         "policy": data[0].result.policy,
//         "signature": data[0].result.signature,
//         "Content-Type": "image/jpeg"
//       }
//       let options: FileUploadOptions = {
//         fileKey: 'file',
//         fileName: fileName,
//         chunkedMode: false,
//         mimeType: "image/jpeg",
//         params: params,
//       }
//
//       this.fileTransfer.upload(filePath, "https://smartiebucket.s3.amazonaws.com/", options)
//         .then((data) => {
//           console.log(data);
//           // success
//         }, (err) => {
//           console.log(err);
//           // error
//         })
//     }, (err) => {
//       console.log(err);
//     })
//   }
//
//   saveToCredentialClass(profile, fileUrl) {
//     let Credential = new Parse.Object.extend('Credential');
//     let cred = new Credential();
//     cred.set('profile', profile);
//     cred.set('file', fileUrl);
//     cred.save({ useMasterKey: true }).then(credential => {
//       console.log(credential);
//       console.log("Credentials saved successfully..!");
//     }).fail((e) => {
//       console.log(e);
//     });
//   }
//
// }
