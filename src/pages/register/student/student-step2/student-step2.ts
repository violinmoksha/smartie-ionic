import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Slides } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { RegisterStudentStep3 } from './../student-step3/student-step3';

/**
 * Generated class for the StudentStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-student-step2',
  templateUrl: 'student-step2.html',
})
export class RegisterStudentStep2 {

  private Studentstep2Form: FormGroup;
  private form1Values: any;
  pageProfileSrc:string = './assets/img/user-img-student.png';
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  schoolOrNot: string;
  @ViewChild(Slides) studentSchool: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController) {

    this.form1Values = navParams.data.form1Value;

    this.Studentstep2Form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      profileMessage: new FormControl('', Validators.required),
      studentSchoolName: new FormControl('')
    })
  }

  chooseUploadType(inputEvent){
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
              this.cameraData = 'data:image/jpeg;base64,' + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraData);
              this.photoTaken = true;
              this.photoSelected = false;
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
            console.log('Gallery clicked');
            let options = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              quality : 100
            };

            this.camera.getPicture(options).then((imageData) => {
             // imageData is either a base64 encoded string or a file URI
             // If it's base64:
              this.cameraUrl = "data:image/jpeg;base64," + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraUrl);
              // console.log(this.cameraUrl);
              this.photoSelected = true;
              this.photoTaken = false;
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

  public filterSchoolOrNot(result: string): void {
    // Handle what to do when a category is selected
    console.log(result);
    if(result == 'yes'){
      this.Studentstep2Form.get('studentSchoolName').setValidators([Validators.required]);
    }else{
      this.Studentstep2Form.get('studentSchoolName').setValidators([]);
    }
    this.schoolOrNot = result;
  }

  next(form2Value){
    this.navCtrl.push(RegisterStudentStep3, { form1Value: this.form1Values, form2Value : form2Value });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentStep2Page');
  }

}
