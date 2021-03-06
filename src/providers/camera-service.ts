import { ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Page } from './../../../e2e/app.po';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
/*
  Generated class for the CameraServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraServiceProvider {

  constructor(public camera: Camera, public actionSheetCtrl: ActionSheetController, public imagePicker: ImagePicker, public storage: Storage, public fileService: File) {
  }

  getCameraOptions() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      targetHeight: 800,
      targetWidth: 800
    }
    return options;
  }

  getGalleryOptions() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    return options;
  }

  choosePictures() {
    let options = {
      maximumImagesCount: 1,
      quality: 100,
      width: 512,
      height: 512,
      outputType: 0
    }
    return new Promise((resolve, reject) => {
      this.imagePicker.hasReadPermission().then((res) => {
        if (res) {
          this.imagePicker.getPictures(options).then((image) => {
            resolve(image);
          }, (err) => {
            reject(err);
          });
        } else {
          this.imagePicker.requestReadPermission().then((res) => {
            this.imagePicker.getPictures(options).then((image) => {
              resolve(image);
            }, (err) => {
              reject(err);
            });
          })
        }
      })
    })
  }

  returnFileAsDataURL(path, name) {
    return new Promise((resolve, reject) => {
      this.fileService.readAsDataURL(path, name).then(result => {
        resolve(result)
      }, err => {
        reject(err)
      })
    });
  }


  getImage() {
    return new Promise((resolve, reject) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'How you like to upload your photos',
        buttons: [
          {
            text: 'Take Picture',
            role: 'destructive',
            icon: 'camera',
            handler: () => {
              this.camera.getPicture(this.getCameraOptions()).then((image) => {
                // //NOTE: converting(normalizing the URL due to cordova web view plugin upgrade)
                // image = this.ionicWebView.convertFileSrc(image);
                // let path = image.substring(0, image.lastIndexOf("/"));
                // let name = image.substring(image.lastIndexOf("/")+1);
                let normalizedFile = window['Ionic']['WebView'].convertFileSrc(image);
                // this.returnFileAsDataURL(path, name).then(res => {
                //   console.log(res);
                // })
                let imageArray = [image];
                let result = {imageUrl:imageArray[0], normalizedUrl:normalizedFile}
                resolve(result);
              }, (err) => {
                reject(err);
              });
            }
          }, {
            text: 'Open Gallery',
            role: 'openGallery',
            icon: 'image',
            handler: () => {
              this.choosePictures().then((pics: any) => {
                if(pics.length > 0){
                  let normalizedFile = window['Ionic']['WebView'].convertFileSrc(pics[0]);
                  let result = {imageUrl:pics[0], normalizedUrl:normalizedFile}
                  resolve(result);
                }else{
                  reject(pics);
                }
              }, (err) => {
                reject(err);
              });
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close',
            handler: () => {
              actionSheet.dismiss();
              return false;
            }
          }
        ]
      });
      actionSheet.present();
    })
  }

  async getFileName() {
    return await this.storage.get('UserProfile').then(async user => {
      let name = user ? user.userData.objectId : 'file';
      return name + Math.floor(Math.random() * 9999) + 1000;
    });
  }
}
