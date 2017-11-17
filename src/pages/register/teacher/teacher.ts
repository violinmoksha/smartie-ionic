import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AbstractControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { RegisterTeacherStep2 } from './../teacher-step2/teacher-step2';

@Component({
  selector: 'teacher-register',
  templateUrl: 'teacher.html'
})

export class RegisterTeacher {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private Teacherstep1Form: FormGroup;

  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  private formBuilder: FormBuilder;
  constructor(public navCtrl: NavController, private camera: Camera, public actionSheetCtrl: ActionSheetController) {

    //Password matcher customValidator
    function passwordMatcher(c: AbstractControl){
      return c.get('password').value === c.get('confPassword').value ? null : { 'notmatch' : true };
    }

    this.Teacherstep1Form = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      passwords: this.formBuilder.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        confPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      }, {validator : passwordMatcher}),
      phone: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      native: ['', Validators.required],
      nationality: ['', Validators.required],
      profileTitle: ['', Validators.required],
      teacherMessage: ['', Validators.required],
    });

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

  next(form1Value){
    this.navCtrl.push(RegisterTeacherStep2, { form1Value : form1Value });
  }

  //Form submit to get values
  Teacherstep1FormSubmit(){
    console.log(this.Teacherstep1Form.value)
  }

}
