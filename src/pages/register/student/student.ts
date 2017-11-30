import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';
import { RegisterStudentStep2 } from './student-step2/student-step2';

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
  private StudentStep1Form : FormGroup;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController, private smartieApi: SmartieAPI, private alertCtrl: AlertController) {

    this.StudentStep1Form = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6),  this.equalTo('password')])
    });
    //Password matcher customValidator
    /*function passwordMatcher(c: AbstractControl){
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
    */
  }

  equalTo(equalControlName): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control['_parent']) return null;
      if (!control['_parent'].controls[equalControlName])
      throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
      var controlMatch = control['_parent'].controls[equalControlName];
      return controlMatch.value == control.value ? null : {
        'equalTo': true
      };
    };
  }

  next(form1Value){
    this.navCtrl.push(RegisterStudentStep2, { form1Value : form1Value });
  }


  /*onpartOfSchoolValueChanged(value){
    let studentSchoolNameControl = this.StudentForm.get('studentSchoolName');
    if(value){
      studentSchoolNameControl.setValidators([Validators.required]);
    }else{
      studentSchoolNameControl.setValidators([]);
    }

    studentSchoolNameControl.updateValueAndValidity(); //Need to call this to trigger a update
  }*/


  /*StudentSubmit(studentData){
    let API = this.smartieApi.getApi(
      'signupParentOrStudent',
      {role: 'student', username: studentData.username, password: studentData.passwords.password, email: studentData.email, fullname: studentData.name, phone: studentData.phone, profileabout: studentData.studentMessage, langreq: studentData.expertiseLangNeed, levelreq: studentData.requiredLevel, preflocation: studentData.preferedLearningLocation, prefpayrate: studentData.desiredHourlyPriceRange, partofschool: studentData.partOfSchool, schoolname: studentData.parentSchoolName, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("studentSignupUserProfile", JSON.stringify(signupResult.result));

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
    });

  } */

  /* setProfilePic(){
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
  } */

}
