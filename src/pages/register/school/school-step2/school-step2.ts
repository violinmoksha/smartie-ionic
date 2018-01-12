import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { RegisterSchoolStep3 } from './../school-step3/school-step3';

/**
 * Generated class for the SchoolStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-school-step2',
  templateUrl: 'school-step2.html',
})
export class RegisterSchoolStep2 {

  pageProfileSrc:string = './assets/img/user-img-school.png';
  pageSchoolSrc:string = './assets/img/school-img.png';
  private form1Values: any;
  private SchoolStep2Form : FormGroup;
  profileCameraData: string;
  schoolCameraData: string;
  profilePhotoTaken: boolean;
  schoolPhotoTaken: boolean;
  profileCameraUrl: string;
  schoolCameraUrl: string;
  profilePhotoSelected: boolean;
  schoolPhotoSelected: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController) {

    this.form1Values = navParams.data.form1Value;

    this.SchoolStep2Form = new FormGroup({
      schoolName: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      contactPosition: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      profileMessage: new FormControl('', Validators.required)
    });
  }

  chooseUploadType(inputEvent, photoFor){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How you like to upload your photos',
      buttons: [
        {
          text: 'Take Picture',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            var options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL
            };
            this.camera.getPicture(options).then((imageData) => {
              if(photoFor == 'prof'){
                this.profileCameraData = 'data:image/jpeg;base64,' + imageData;
                localStorage.setItem('profilePhotoDataUrl', this.profileCameraData);
                this.profilePhotoTaken = true;
                this.profilePhotoSelected = false;
              }else if(photoFor == 'school'){
                this.schoolCameraData = 'data:image/jpeg;base64,' + imageData;
                localStorage.setItem('schoolPhotoDataUrl', this.schoolCameraData);
                this.schoolPhotoTaken = true;
                this.schoolPhotoSelected = false;
              }
            }, (err) => {
            // Handle error
              console.log(err);
            });
          }
        },{
          text: 'Open Gallery',
          role: 'openGallery',
          icon: 'image',
          handler: () => {
            let options = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              quality : 100
            };

            this.camera.getPicture(options).then((imageData) => {
              console.log(photoFor);
             // imageData is either a base64 encoded string or a file URI
             // If it's base64:
              if(photoFor == 'prof'){
                this.profileCameraUrl = "data:image/jpeg;base64," + imageData;
                localStorage.setItem('profilePhotoDataUrl', this.profileCameraUrl);
                this.profilePhotoSelected = true;
                this.profilePhotoTaken = false;
              }else if(photoFor == 'school'){
                this.schoolCameraUrl = "data:image/jpeg;base64," + imageData;
                localStorage.setItem('schoolPhotoDataUrl', this.schoolCameraUrl);
                this.schoolPhotoSelected = true;
                this.schoolPhotoTaken = false;
              }
              // console.log(this.cameraUrl);

            }, (err) => {
             // Handle error
             console.log(err);
            });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  next(form2Value){
    this.navCtrl.push(RegisterSchoolStep3, { form1Value: this.form1Values, form2Value : form2Value });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolStep2Page');
  }

}
