import { ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Page } from './../../../e2e/app.po';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
/*
  Generated class for the CameraServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraServiceProvider {

  constructor(public camera: Camera, public actionSheetCtrl: ActionSheetController, public imagePicker: ImagePicker, public storage: Storage) {
    console.log('Hello CameraServiceProvider Provider');
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
                let imageArray = [image];
                resolve(imageArray);
              }, (err) => {
                reject(err);
              });
            }
          }, {
            text: 'Open Gallery',
            role: 'openGallery',
            icon: 'image',
            handler: () => {
              this.choosePictures().then((pics) => {
                resolve(pics);
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
