import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DataService } from '../app/app.data';
import { AngularFireStorage } from '@angular/fire/storage';
import { File } from '@ionic-native/file';
import { AngularFireAuth } from '@angular/fire/auth';

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
  constructor(private transfer: FileTransfer, public dataService: DataService, public fireUpload: AngularFireStorage, public fileService: File, public fireAuth: AngularFireAuth) {
    this.fileTransfer = this.transfer.create();
    // this.awsBucket = {"feedback":"Feedbacks", "credential":"Credentials", "profile":"Profile", "drivingLicense": "DrivingLicense"}
    // initializeApp(Constants.firebaseConfig);
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

  uploadToFCS(filePath, bucketName = null){
    // this.fireAuth.auth.signInAnonymously();
    let fileName = filePath.substr(filePath.lastIndexOf('/') + 1),
    path = filePath.substr(0, filePath.lastIndexOf('/'));
    console.log(filePath);
    console.log(fileName);
    try{
      return new Promise((resolve, reject) => {
        console.log("File Upload debug");
        this.fileService.resolveLocalFilesystemUrl(path).then(entry => {
          this.fileService.readAsDataURL(entry.nativeURL, fileName).then(result => {
            let base64Result = result.split(',')[1];
            console.log("File Upload read as date success");
            try{
              this.fireAuth.auth.signInAnonymously().then(() => {
                console.log("Firebase auth signed successfully");
                try {
                  const ref = this.fireUpload.ref(bucketName+'/'+fileName);
                  console.log(ref);
                  ref.putString(base64Result, 'base64', { contentType: 'image/jpeg'}).then(async result => {
                    let profilePhotoUrl = await result.ref.getDownloadURL();
                    resolve(profilePhotoUrl);
                  }, (uploadErr) => {
                    console.log(uploadErr);
                  });
                } catch (putErr) {
                  console.log(putErr);
                }
              }, firebaseAuthErr => {
                console.log(firebaseAuthErr);
                reject(firebaseAuthErr);
              })
            } catch (authErr) {
              console.log(authErr);
            }
          }, err => {
            console.log('readAsDataURL error: '+err);
            reject(err)
          })
        });
      });
    } catch (fileError) {
      console.log(fileError);
    }

  }

  /*uploadFileToAWS(filePath) {
    //let file = filePath.substr(0, filePath.lastIndexOf('/'));
    this.uploadToFCS(filePath);
    return new Promise((resolve, reject) => {
      resolve(true)
    })*/
    // return new Promise((resolve, reject) => {
    //   let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
    //
    //   console.log('Going in with fileName: '+fileName);
    //   this.dataService.getApi('getAWSCredential', { 'fileName': fileName }).then(async API => {
    //     this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async (signedUrl) => {
    //       let options: FileUploadOptions = {
    //         fileKey: fileName,
    //         fileName: fileName,
    //         chunkedMode: false,
    //         mimeType: "image/jpeg",
    //         httpMethod:'PUT',
    //         headers: {}
    //       }
    //      console.log('Going in with signedUrl of: '+signedUrl.result);
    //      this.fileTransfer.upload(filePath, signedUrl.result, options).then(data => {
    //           console.log("FileUpload");
    //           console.log(data);
    //           //let filePath = signedUrl.result.split('?')[0];
    //           resolve(signedUrl.result);
    //         }, (err) => {
    //           console.log(err);
    //           reject(err);
    //         })
    //     }, (err) => {
    //       console.log(err);
    //       reject(err);
    //     })
    //   });
    // })
  // }

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
