import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';

/**
 * Generated class for the SchoolPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-school',
  templateUrl: 'school.html',
})
export class RegisterSchool {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  pageSchoolSrc:string = './assets/img/school-img.png';
  private SchoolForm : FormGroup;
  profileCameraData: string;
  schoolCameraData: string;
  profilePhotoTaken: boolean;
  schoolPhotoTaken: boolean;
  profileCameraUrl: string;
  schoolCameraUrl: string;
  profilePhotoSelected: boolean;
  schoolPhotoSelected: boolean;

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController, private smartieApi: SmartieAPI, private alertCtrl: AlertController) {

    //Password matcher customValidator
    function passwordMatcher(c: AbstractControl){
      return c.get('password').value === c.get('confPassword').value ? null : { 'notmatch' : true };
    }

    this.SchoolForm = this.formBuilder.group({
      schoolName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactPosition: ['', Validators.required],
      username: ['', Validators.required],
      passwords: this.formBuilder.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        confPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      }, {validator : passwordMatcher}),
      phone: ['', Validators.required],
      email: ['', Validators.required],
      requiredLevel: ['', Validators.required],
      expertiseLangNeed: ['', Validators.required],
      preferedLearningLocation: ['', Validators.required],
      desiredHourlyPriceRange: ['', Validators.required],
      schoolMessage: ['', Validators.required]
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

  SchoolSubmit(schoolData){
    let API = this.smartieApi.getApi(
      'signupSchool',
      {role: 'school', username: schoolData.username, password: schoolData.passwords.password, email: schoolData.email, schoolname: schoolData.schoolName, contactname: schoolData.contactName, contactposition: schoolData.contactPosition, phone: schoolData.phone, levelreq: schoolData.levelsRequired, langreq: schoolData.expertiseLangNeed, profileabout: schoolData.schoolMessage, preflocation: schoolData.preferedLearningLocation, prefpayrate: schoolData.desiredHourlyPriceRange, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("schoolSignupUserProfile", JSON.stringify(signupResult.result));

          // if(localStorage.getItem('profilePhotoDataUrl') == null && localStorage.getItem('schoolPhotoDataUrl') == null ){
            this.navCtrl.push(TotlesSearch, {role: 'parent', fromwhere: 'signUp'});
          // }else{
          //   this.setProfilePic().then((pictureResolve) => {
          //     this.navCtrl.push(TotlesSearch, {role: 'parent', fromwhere: 'signUp'});
          //   }).catch((pictureReject) => {
          //     console.log(pictureReject);
          //   });
          // }

        },
        err => {
          let signupError = JSON.parse(err.text());
          // console.log(signupError);
          let alert = this.alertCtrl.create({
            title: 'Signup Failed !',
            subTitle: signupError.error.split(':')[2],
            buttons: ['OK']
          });
          alert.present();
        }
      )
    });

  }

}
