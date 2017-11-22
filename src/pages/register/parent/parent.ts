import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the ParentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html',
})
export class RegisterParent {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private ParentForm : FormGroup;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController, private smartieApi: SmartieAPI, private alertCtrl: AlertController) {

    //Password matcher customValidator
    function passwordMatcher(c: AbstractControl){
      return c.get('password').value === c.get('confPassword').value ? null : { 'notmatch' : true };
    }

    //Module driven parent formBuilder
    this.ParentForm = this.formBuilder.group({
      name: ['', Validators.required],
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
      parentMessage: ['', Validators.required],
      partOfSchool: ['false'],
      parentSchoolName: [''],
    });

    this.ParentForm.get('partOfSchool').valueChanges.subscribe(data => this.onpartOfSchoolValueChanged(data));
  }

  onpartOfSchoolValueChanged(value){
    let parentSchoolNameControl = this.ParentForm.get('parentSchoolName');
    if(value){
      parentSchoolNameControl.setValidators([Validators.required]);
    }else{
      parentSchoolNameControl.setValidators([]);
    }

    parentSchoolNameControl.updateValueAndValidity(); //Need to call this to trigger a update
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

  ParentSubmit(parentData){
    let API = this.smartieApi.getApi(
      'signupParentOrStudent',
      {role: 'student', username: parentData.username, password: parentData.passwords.password, email: parentData.email, fullname: parentData.name, phone: parentData.phone, profileabout: parentData.studentMessage, langreq: parentData.expertiseLangNeed, levelreq: parentData.requiredLevel, preflocation: parentData.preferedLearningLocation, prefpayrate: parentData.desiredHourlyPriceRange, partofschool: parentData.partOfSchool, schoolname: parentData.parentSchoolName, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("parentSignupUserProfile", JSON.stringify(signupResult.result));

          if(localStorage.getItem('profilePhotoDataUrl') == null){
            this.navCtrl.push(TotlesSearch, {role: 'parent', fromwhere: 'signUp'});
          }else{
            this.setProfilePic().then((pictureResolve) => {
              this.navCtrl.push(TotlesSearch, {role: 'parent', fromwhere: 'signUp'});
            }).catch((pictureReject) => {
              console.log(pictureReject);
            });
          }

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

  setProfilePic(){
    return new Promise(function(resolve, reject){

      let parseFile = new Parse.File('photo.jpg', {base64: localStorage.getItem('profilePhotoDataUrl')});
      parseFile.save().then((file) => {
        let parentSignupUserProfile = JSON.parse(localStorage.getItem("parentSignupUserProfile"));
        let profileId = parentSignupUserProfile.profile.objectId;
        let profQuery = new Parse.Query(new Parse.Object.extend('Profile'));

        profQuery.get(profileId, {
          success: function(profile) {
            profile.set('profilePhoto', file);
            profile.save();
            resolve('success');
          }, error: function(profile, error) {
            // TODO: internet connection problem err
            reject('failed');
          }
        });
      });
    });
  }

}
