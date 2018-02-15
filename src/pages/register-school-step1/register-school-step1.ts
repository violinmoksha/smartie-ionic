import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

/**
 * Generated class for the RegisterSchoolPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-register-school-step1',
  templateUrl: 'register-school-step1.html',
})
export class RegisterSchoolStep1Page {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  pageSchoolSrc:string = './assets/img/school-img.png';
  private SchoolStep1Form : FormGroup;
  /*profileCameraData: string;
  schoolCameraData: string;
  profilePhotoTaken: boolean;
  schoolPhotoTaken: boolean;
  profileCameraUrl: string;
  schoolCameraUrl: string;
  profilePhotoSelected: boolean;
  schoolPhotoSelected: boolean;*/

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.SchoolStep1Form = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6),  this.equalTo('password')])
    });

    //Password matcher customValidator
    /*function passwordMatcher(c: AbstractControl){
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
    }); */
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
    this.navCtrl.push("RegisterSchoolStep2Page", { form1Value : form1Value });
  }

  /* */

  /* SchoolSubmit(schoolData){
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
            subTitle: signupError.error.split(':')[2].split(/[0-9]{3}\s/g)[1],
            buttons: ['OK']
          });
          alert.present();
        }
      )
    });

  } */

}
