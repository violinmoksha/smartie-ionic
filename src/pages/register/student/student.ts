import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Constants } from '../../../app/app.constants';
//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';

/**
 * Generated class for the StudentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-student',
  templateUrl: 'student.html',
})
export class RegisterStudent {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private StudentForm : FormGroup;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  private baseUrl: string;
  private applicationId: string;
  private masterKey: string;
  private contentType: string;

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController, private http: HttpClient, private alertCtrl: AlertController) {

    //Password matcher customValidator
    function passwordMatcher(c: AbstractControl){
      return c.get('password').value === c.get('confPassword').value ? null : { 'notmatch' : true };
    }

    //Module driven student formBuilder
    this.StudentForm = this.formBuilder.group({
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
      studentMessage: ['', Validators.required],
      partOfSchool: ['false'],
      studentSchoolName: [''],
    });

    this.StudentForm.get('partOfSchool').valueChanges.subscribe(data => this.onpartOfSchoolValueChanged(data));
  }

  onpartOfSchoolValueChanged(value){
    let studentSchoolNameControl = this.StudentForm.get('studentSchoolName');
    if(value){
      studentSchoolNameControl.setValidators([Validators.required]);
    }else{
      studentSchoolNameControl.setValidators([]);
    }

    studentSchoolNameControl.updateValueAndValidity(); //Need to call this to trigger a update
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

  StudentSubmit(studentData){
    if(Constants.API_ENDPOINTS.env === 'local'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.local;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'test'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.test;
      this.applicationId = Constants.API_ENDPOINTS.headers.localAndTest.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.localAndTest.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.localAndTest.contentType;
    }else if(Constants.API_ENDPOINTS.env === 'prod'){
      this.baseUrl = Constants.API_ENDPOINTS.baseUrls.prod;
      this.applicationId = Constants.API_ENDPOINTS.headers.prod.applicationId;
      this.masterKey = Constants.API_ENDPOINTS.headers.prod.masterKey;
      this.contentType = Constants.API_ENDPOINTS.headers.prod.contentType;
    }

    let postUrl = this.baseUrl + Constants.API_ENDPOINTS.paths.fn + Constants.API_ENDPOINTS.signupParentOrStudent;
    let headers = new HttpHeaders();
    headers.append('X-Parse-Application-Id', this.applicationId);
    headers.append('X-Parse-Master-Key', this.masterKey);
    headers.append('Content-Type', this.contentType);
    let body = {role: 'student', username: studentData.username, password: studentData.passwords.password, email: studentData.email, fullname: studentData.name, phone: studentData.phone, profileabout: studentData.studentMessage, langreq: studentData.expertiseLangNeed, levelreq: studentData.requiredLevel, preflocation: studentData.preferedLearningLocation, prefpayrate: studentData.desiredHourlyPriceRange, partofschool: studentData.partOfSchool, schoolname: studentData.parentSchoolName, langpref: 'en'}

    return this.http.post(postUrl, body, { headers: headers }).subscribe(
      data => {
//      let signupResult = JSON.parse(data.text());
//      localStorage.setItem("studentSignupUserProfile", JSON.stringify(signupResult.result));

        if(localStorage.getItem('profilePhotoDataUrl') == null){
          this.navCtrl.push(TotlesSearch, {role: 'student', fromwhere: 'signUp'});
        }else{
          this.setProfilePic().then((pictureResolve) => {
            this.navCtrl.push(TotlesSearch, {role: 'student', fromwhere: 'signUp'});
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
  }

  setProfilePic(){
    return new Promise(function(resolve, reject){

      let parseFile = new Parse.File('photo.jpg', {base64: localStorage.getItem('profilePhotoDataUrl')});
      parseFile.save().then((file) => {
        let studentSignupUserProfile = JSON.parse(localStorage.getItem("studentSignupUserProfile"));
        let profileId = studentSignupUserProfile.profile.objectId;
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
