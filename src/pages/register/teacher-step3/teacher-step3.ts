import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Slides, ModalController } from 'ionic-angular';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { ParseProvider } from '../../../providers/parse';
import { TotlesSearch } from '../../totles-search/totles-search';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
import { Pro } from '@ionic/pro';

/**
 * Generated class for the TeacherStep3Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-teacher-step3',
  templateUrl: 'teacher-step3.html',
})
export class RegisterTeacherStep3 {

  private Teacherstep3Form : FormGroup;
  public TeacherFiles: any;
  public TeacherFilesView: any;
  public fileData: any;
  private form1Values: any;
  private form2Values: any;
  // private formBuilder: FormBuilder;
  @ViewChild(Slides) yearExp: Slides;
  @ViewChild(Slides) hourRate: Slides;
  @ViewChild(Slides) curr: Slides;
  private yearExperience: any;
  private hourlyRate: any;
  private userCurrency: any;
  private startDate: any;
  private endDate: any;
  public languages: any;

  /*public languages = [
    { langid: 1, name: "English", value: "englsh" },
    { langid: 2, name: "Thai", value: "thai" },
    { langid: 3, name: "Chinese", value: "chinese" },
    { langid: 4, name: "Japanese", value: "japanese" },
    { langid: 5, name: "French", value: "french" }
  ];*/

  public levels = [
    { "name": "Elementary K-5", "value": "k5"},
    { "name": "Middle School", "value": "middle" },
    { "name": "High School", "value": "highSchool" },
    { "name": "University", "value": "university" }
  ];

  public years = [
    { "value": '1', "text": '1' },
    { "value": '2', "text": '2' },
    { "value": '3', "text": '3' },
    { "value": '4', "text": '4' },
    { "value": '5', "text": '5' },
    { "value": '6', "text": '6' },
    { "value": '7', "text": '7' },
    { "value": '8', "text": '8' },
    { "value": '9', "text": '9' },
    { "value": '10', "text": '10' },
    { "value": '11', "text": '11' },
    { "value": '12', "text": '12' },
    { "value": '13', "text": '13' },
    { "value": '14', "text": '14' },
    { "value": '15', "text": '15' },
    { "value": '16', "text": '16' },
    { "value": '17', "text": '17' },
    { "value": '18', "text": '18' },
    { "value": '19', "text": '19' },
    { "value": '20', "text": 'More than 20' }
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

  public currencies = [
    { "value": 'USD', "text": 'US Dollar' },
    { "value": 'EUR', "text": 'Euro' },
    { "value": 'AUD', "text": 'Aus Dollar' },
    { "value": 'INR', "text": 'Rupee' },
    { "value": 'THB', "text": 'Thai Baht' },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private parse: ParseProvider, private modalCtrl: ModalController) {

    //this.languages = navParams.data.form2Value.languages;
    //this.languages = ['English', 'Spanish', 'Chinese', 'Hindi'];

    function dateValidator(c: AbstractControl){
      return c.get('startDate').value < c.get('endDate').value ? null : { 'dateGreater' : true };
    }

    function timeValidator(c: AbstractControl){
      return c.get('startTime').value < c.get('endTime').value ? null : { 'timeGreater' : true };
    }

    this.form1Values = navParams.data.form1Value;
    this.form2Values = navParams.data.form2Value;

    this.Teacherstep3Form = new FormGroup({
      teacherLanguage: new FormArray([], Validators.required),
      teacherLevel: new FormArray([], Validators.required),
      teacherCvCerts: new FormControl(''),
      prefLocation: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
    })
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

  public filterCurrency(curr: number): void {
    // Handle what to do when a category is selected
    console.log(curr);
    this.userCurrency = curr;
  }

  // Method executed when the slides are changed
  public currencyChanged(): void {
    let currentIndex = this.curr.getActiveIndex();
    console.log(currentIndex);
  }

  onChangeTeacherLanguage(name: string, isChecked: boolean) {
    const knownLanguage = <FormArray>this.Teacherstep3Form.controls.teacherLanguage;

    if(isChecked) {
      knownLanguage.push(new FormControl(name));
    } else {
      let index = knownLanguage.controls.findIndex(x => x.value == name)
      knownLanguage.removeAt(index);
    }
  }

  onChangeLevelLanguage(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.Teacherstep3Form.controls.teacherLevel;
    console.log(knownLevel);

    if(isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
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

  finalTeacherSubmit(form3Values){

    let API = this.smartieApi.getApi(
      'signupTeacher',
      {role: 'teacher', username: this.form1Values.username.toLowerCase(), password: this.form1Values.password, email: this.form1Values.email.toLowerCase(), fullname: this.form2Values.name, phone: this.form2Values.phone, age: this.form2Values.age, nativelang: this.form2Values.native, nationality: this.form2Values.nationality, profiletitle: this.form2Values.profileTitle, profileabout: this.form2Values.profileMessage, expertlangs: form3Values.teacherLanguage, levelscapable: form3Values.teacherLevel, yrsexperience: this.yearExperience, preflocation: form3Values.prefLocation, prefpayrate: this.hourlyRate, prefcurrency: this.userCurrency, defstartdate: this.startDate, defenddate: this.endDate, defstarttime: form3Values.startTime, defendtime: form3Values.endTime, langpref: 'en'}
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
              }).catch((pictureReject) => {
                console.log(pictureReject);
              });
            })
          }else{
            this.setProfilePic().then((pictureResolve) => {
              console.log('test');
              this.navCtrl.push(TotlesSearch, {role: 'teacher', fromwhere: 'signUp'});
            }).catch((pictureReject) => {
              console.log(pictureReject);
            });
          }
        },
        err => {
          let signupError = err.error;
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
}
