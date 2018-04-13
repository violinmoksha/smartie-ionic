import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController, LoadingController  } from 'ionic-angular';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';
import { Parse } from 'parse';
import { ParseProvider } from '../../providers/parse';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegisterStep3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-step3',
  templateUrl: 'register-step3.html',
})
export class RegisterStep3Page {

  // private submitInProgress: boolean;
  private loading: any;
  private form1Values: any;
  private form2Values: any;
  private Step3Form : FormGroup;
  public TeacherFiles: any;
  public TeacherFilesView: any;
  public fileData: any;
  @ViewChild(Slides) yearExp: Slides;
  @ViewChild(Slides) hourRate: Slides;
  private yearExperience: any;
  private hourlyRate: any;
  private userCurrency: any;
  private startDate: any;
  private endDate: any;
  private role: any;

  public event = {
    timeStarts: '10:00',
    timeEnds: '22:00'
  }

  public years = [
    { "value": 1, "text": '1' },
    { "value": 2, "text": '2' },
    { "value": 3, "text": '3' },
    { "value": 4, "text": '4' },
    { "value": 5, "text": '5' },
    { "value": 6, "text": '6' },
    { "value": 7, "text": '7' },
    { "value": 8, "text": '8' },
    { "value": 9, "text": '9' },
    { "value": 10, "text": '10' },
    { "value": 11, "text": '11' },
    { "value": 12, "text": '12' },
    { "value": 13, "text": '13' },
    { "value": 14, "text": '14' },
    { "value": 15, "text": '15' },
    { "value": 16, "text": '16' },
    { "value": 17, "text": '17' },
    { "value": 18, "text": '18' },
    { "value": 19, "text": '19' },
    { "value": 20, "text": 'More than 20' }
  ];

  public hourRates = [
    { "text": '5', "value": 5 },
    { "text": '10', "value": 10 },
    { "text": '15', "value": 15 },
    { "text": '20', "value": 20 },
    { "text": '25', "value": 25 },
    { "text": '30', "value": 30 },
    { "text": '35', "value": 35 },
    { "text": '40', "value": 40 },
    { "text": '45', "value": 45 },
    { "text": '50', "value": 50 },
    { "text": '55', "value": 55 },
    { "text": '60', "value": 60 },
    { "text": '65', "value": 65 },
    { "text": '70', "value": 70 },
    { "text": '75', "value": 75 },
    { "text": '80', "value": 80 },
    { "text": '85', "value": 85 },
    { "text": '90', "value": 90 },
    { "text": '95', "value": 95 },
    { "text": '100', "value": 100 }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, private storage: Storage, private parse: ParseProvider) {
    // this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });
    this.form1Values = navParams.data.form1Values;
    this.form2Values = navParams.data.form2Values;
    this.role = navParams.data.role;

    var today = new Date();
    this.startDate = today.getMonth()+1 +'-'+today.getDate()+'-'+today.getFullYear();
    var defEndDate = new Date(today.setDate(today.getDate() + 365));
    this.endDate = defEndDate.getMonth()+1 +'-'+defEndDate.getDate()+'-'+defEndDate.getFullYear();

    //profilePhoto
    this.storage.get('profilePhotoDataUrl').then(profilePhoto => {
      //this.form2Values.profilePhoto = profilePhoto;
    })

    if(this.role == 'teacher'){
      this.Step3Form = new FormGroup({
        teacherCvCerts: new FormControl(''),
        prefLocation: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
      })
    }else{
      this.Step3Form = new FormGroup({
        prefLocation: new FormControl('', Validators.required)
      })
    }
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
      pickMode: 'single'
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.startDate = date.months + '-' + date.date + '-' + date.years;
        console.log(this.startDate);
      }
    })
  }

  endDateCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'single'
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.endDate = date.months + '-' + date.date + '-' + date.years;
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
    console.log(typeof rate);
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }

  addTeacherCvCert(files){
    let TeacherCVs = new Array();
    let TeacherCVsView = new Array();
    let requests = files.length;
    // let k = 0;
    for(let file of files){
      TeacherCVsView.push(file);
      this.getBase64(file).then((obj) => {
        // console.log(k);
        // TeacherCVs[k]['name'] = obj['name'];
        // TeacherCVs[k]['data'] = obj['data'];
        TeacherCVs.push({name: obj['name'],data: obj['data']});
        requests--;
        // k++;
        // Call Parse Login function with those variables
        /*Parse.User.logIn('alphateacher9', 'alphateacher1', {
          // If the username and password matches
          success: function(user) {
          var parseCvFile = new Parse.File(obj['name'], {base64: obj['data']});
          // console.log(parseCvFile);
            parseCvFile.save({useMasterKey :true}).then(function(cvFile){
              console.log('Test');
              console.log(cvFile);
              TeacherCVs.push(cvFile);
            });
          },
          // If there is an error
          error: function(user, error) {
            console.log(error);
          }
        });*/
        if(requests == 0) {
          this.storage.set('teacherCreds', TeacherCVs);
        }
      });

    }

    // this.TeacherFiles = TeacherCVs;
    this.TeacherFilesView = TeacherCVsView;
    //storing object in localstorage using JSON.stringify
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

  finalRegisterSubmit(form3Values){
    // this.submitInProgress = true;
    this.loading.present();

    form3Values.prefPayRate = this.hourlyRate;
    if(this.role == 'teacher'){
      form3Values.yrseExperience = this.yearExperience;
      form3Values.defaultStartDate = this.startDate;
      form3Values.defaultEndDate = this.endDate;
    }

    let API = this.smartieApi.getApi(
      'signUpRole',
      {role: this.role, accountInfo: this.form1Values, profileInfo: this.form2Values, userInfo: form3Values}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          this.storage.set("UserProfile", signupResult.result);
          let API = this.smartieApi.getApi(
            'fetchNotifications',
            { profileId: signupResult.result.profileData.objectId, role: this.role }
          );

          return new Promise(resolve => {
            interface Response {
              result: any
            };
            this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
              this.loading.dismiss();
              this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role });
                //this.navCtrl.push("SmartieSearch", { role: this.role, fromWhere: 'signUp', loggedProfileId: signupResult.result.profileData.objectId, notifications: notifications });
              })
            }, err => {
              console.log(err);
            });
          });
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Signup Failed!',
            subTitle: JSON.stringify(err),
            buttons: ['OK']
          });
          this.loading.dismiss();
          alert.present();
        }
      )
    });
  }

  /*setProfilePic() {
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
  }*/

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterStep3Page');
  }

}
