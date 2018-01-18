import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Slides, LoadingController } from 'ionic-angular';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { TotlesSearch } from '../../totles-search/totles-search';

/**
 * Generated class for the EditProfileStep3 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile-step3',
  templateUrl: 'edit-profile-step3.html',
})
export class EditProfileStep3 {

  private userRole: string;
  private submitInProgress: boolean;
  private loading: any;
  private EditProfilestep3Form : FormGroup;
  private form1Values: any;
  private form2Values: any;
  @ViewChild(Slides) hourRate: Slides;
  private hourlyRate: any;
  private requiredLevel: any;
  // teacher-specific
  @ViewChild(Slides) yearExp: Slides;
  public TeacherFiles: any;
  public TeacherFilesView: any;
  public fileData: any;
  private yearExperience: any;
  private userCurrency: any;
  private startDate: any;
  private endDate: any;
  private teacherLevel: any;

  public partOfSchool: boolean;
  public prefLocation: string;
  public levels = [
    { "name": "High School", "value": "highSchool" },
    { "name": "University", "value": "university" }
  ];

  public hourRates = [
    { "value": '5', "text": '5' },
    { "value": '10', "text": '10' },
    { "value": '15', "text": '15' },
    { "value": '20', "text": '20' },
    { "value": '25', "text": '25' },
    { "value": '30', "text": '30' },
    { "value": '35', "text": '35' },
    { "value": '40', "text": '40' },
    { "value": '45', "text": '45' },
    { "value": '50', "text": '50' },
    { "value": '55', "text": '55' },
    { "value": '60', "text": '60' },
    { "value": '65', "text": '65' },
    { "value": '70', "text": '70' },
    { "value": '75', "text": '75' },
    { "value": '80', "text": '80' },
    { "value": '85', "text": '85' },
    { "value": '90', "text": '90' },
    { "value": '95', "text": '95' },
    { "value": '100', "text": '100' }
  ];

  //TODO post-<snip><snip> RE registration is: add back currency
  //In V2, but it must be done correctly next time with calculated pre-conversions
  //or maybe even plugged into an AI bot that knows the forex
  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private storage: Storage) {
    this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Editing Account...'
    });

    this.form1Values = navParams.data.form1Value;
    this.form2Values = navParams.data.form2Value;
    this.partOfSchool = navParams.data.partOfSchool;

    this.storage.get("role").then(role => {
      this.userRole = role;

      if (role == 'teacher') {
        this.EditProfilestep3Form = new FormGroup({
          teacherLanguage: new FormArray([], Validators.required),
          teacherLevel: new FormArray([], Validators.required),
          teacherCvCerts: new FormControl(''),
          prefLocation: new FormControl('', Validators.required),
          startTime: new FormControl('', Validators.required),
          endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
        })
      } else {
        this.EditProfilestep3Form = new FormGroup({
          requiredLevel: new FormArray([], Validators.required),
          prefLocation: new FormControl('', Validators.required)
        })
      }
    });
  }

  gretarThan(equalControlName): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control['_parent']) return null;
      if (!control['_parent'].controls[equalControlName])
      throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
      var controlMatch = control['_parent'].controls[equalControlName];
      return controlMatch.value < control.value ? null : {
        'gretarThan': true
      };
    };
  }

  startDateCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
      pickMode: 'single',
      monthFormat: 'MMM YYYY'
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.startDate = date.date + '-' + date.months + '-' + date.years;
        console.log(this.startDate);
      }
    })
  }

  endDateCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.endDate = date.date + '-' + date.months + '-' + date.years;
        console.log(this.endDate);
      }
    })
  }

  public filterYear(years: number): void {
    // Handle what to do when a category is selected
    console.log(years);
    this.yearExperience = years;
  }

  // Method executed when the slides are changed
  public yearChanged(): void {
    let currentIndex = this.yearExp.getActiveIndex();
    console.log(currentIndex);
  }

  addTeacherCvCert(files){
    let TeacherCVs = new Array();
    let TeacherCVsView = new Array();
    for(let file of files){
      TeacherCVsView.push(file);
      this.getBase64(file).then((obj) => {
        var parseCvFile = new Parse.File(obj['name'], {base64: obj['data']});
        parseCvFile.save().then(function(cvFile){
          TeacherCVs.push(cvFile);
        });
      });
    }
    this.TeacherFiles = TeacherCVs;
    this.TeacherFilesView = TeacherCVsView;
    //storing object in localstorage using JSON.stringify
    localStorage.setItem('teacherCreds', JSON.stringify(TeacherCVs));
  }

  getBase64(file) {
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        // var toResolve: object;
        let toResolve: any = {};
        toResolve.name = file.name;
        toResolve.data = this.result;
        resolve(toResolve);
      };
      reader.onerror = function (error) {
        //  console.log('Error: ', error);
        reject(error);
      };
    })
  }


  deleteTeacherCert(fileName){
    this.TeacherFilesView = this.TeacherFilesView.filter(function(el) {
      return el !== fileName;
    });
    this.addTeacherCvCert(this.TeacherFilesView);
  }

  finalEditProfileSubmit(form3Values){
    this.submitInProgress = true;
    this.loading.present();

    let API = this.smartieApi.getApi(
      'editProfile',
      {role: this.userRole, username: this.form1Values.username.toLowerCase(), password: this.form1Values.password, email: this.form1Values.email.toLowerCase(), fullname: this.form2Values.name, phone: this.form2Values.phone, age: this.form2Values.age, nativelang: this.form2Values.native, nationality: this.form2Values.nationality, profiletitle: this.form2Values.profileTitle, profileabout: this.form2Values.profileMessage, expertlangs: form3Values.teacherLanguage, levelscapable: form3Values.teacherLevel, yrsexperience: this.yearExperience, preflocation: form3Values.prefLocation, prefpayrate: this.hourlyRate, prefcurrency: this.userCurrency, defstartdate: this.startDate, defenddate: this.endDate, defstarttime: form3Values.startTime, defendtime: form3Values.endTime, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("teacherUserProfile", JSON.stringify(signupResult.result));

          let cvPromises = [];
          // console.log(this.TeacherFiles);
          if(this.TeacherFiles){
            for(let cvFile of this.TeacherFiles){
              cvPromises.push(this.setTeacherCred(signupResult.result.objectId, cvFile).then((responseResult) => {
                console.log(responseResult);
              }).catch((rejectResult) => {
                console.log(rejectResult);
              }))
            }

            // finish all of the array of promises,
            // then setProfilePic()
            Promise.all(cvPromises).then(()=>{
              this.setProfilePic().then((pictureResolve) => {
                this.navCtrl.push(TotlesSearch, {role: 'teacher', fromwhere: 'signUp'});
                this.loading.dismiss();
              }).catch((pictureReject) => {
                // TODO: do something in a modal?
                console.log(pictureReject);
              });
            })
          }else{
            this.setProfilePic().then((pictureResolve) => {
              this.navCtrl.push(TotlesSearch, {role: 'teacher', fromwhere: 'signUp'});
              this.loading.dismiss();
            }).catch((pictureReject) => {
              // TODO: do something in the UX here!!
              console.log(pictureReject);
            });
          }
        },
        err => {
          let signupError = err.error;
          let alert = this.alertCtrl.create({
            title: 'Signup Failed !',
            subTitle: signupError.error.split(':')[2].split(/[0-9]{3}\s/g)[1],
            buttons: ['OK']
          });
          this.loading.dismiss();
          alert.present();
        }
      )
    });
  }

  setProfilePic() {
    return new Promise(function(resolve, reject){
      if(localStorage.getItem('profilePhotoDataUrl') == null){
        resolve('success');
      }else{
        let parseFile = new Parse.File('photo.jpg', {base64: localStorage.getItem('profilePhotoDataUrl')});
        parseFile.save().then((file) => {
          let teacherUserProfile = JSON.parse(localStorage.getItem("teacherUserProfile"));
          let profileId = teacherUserProfile.profile.objectId;
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
      }
    });

    // function pushSearch(){
    //   console.log('test');
    //   this.navCtrl.push(TotlesSearch, {role: 'teacher', fromwhere: 'signUp'});
    // }
  }
//setProfilePic ends here


  setTeacherCred(teacherId, cvFile){
    return new Promise((resolve, reject) => {
      let teacherQuery = new Parse.Query(new Parse.Object.extend('Teacher'));
      teacherQuery.get(teacherId, {
        success: function(teacher) {
          let Credential = Parse.Object.extend('Credential');
          let cred = new Credential();
          cred.set('teacher', teacher);
          cred.set('file', cvFile);
          cred.save(null, {
            success: function(credential) {
              // console.log(credential);
              resolve(credential);
            },
            error: function(credentials, error) {
              // console.log(error);
              reject(error);
            }
          });
        }, error: function(profile, error) {
          // console.log(error);
          reject(error);
        }
      });
    });
  }

  onChangeLevel(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.EditProfilestep3Form.controls.teacherLevel;
    console.log(knownLevel);

    if(isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    console.log(rate);
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }
}
