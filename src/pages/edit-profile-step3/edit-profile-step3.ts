import { IonicPage } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Slides, LoadingController } from 'ionic-angular';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';
// import { Parse } from 'parse';
const Parse = require('parse');
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";

/**
 * Generated class for the EditProfileStep3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-edit-profile-step3',
  templateUrl: 'edit-profile-step3.html',
})
export class EditProfileStep3Page {

  private userRole: string;
  private submitInProgress: boolean;
  private loading: any;
  private EditProfilestep3Form : FormGroup;
  private form1Values: any;
  private form2Values: any;
  @ViewChild(Slides) hourRate: Slides;
  private hourlyRate: any;
  // private requiredLevel: any;
  // teacher-specific
  @ViewChild(Slides) yearExp: Slides;
  public TeacherFiles: any;
  public TeacherFilesView: any;
  public fileData: any;
  private yearExperience: any;
  // private userCurrency: any;
  private startDate: any;
  private endDate: any;
  // private teacherLevel: any;
  private startTime: any;
  private endTime: any;
  private userData: any;
  private body: any;

  public partOfSchool: boolean;
  public prefLocation: string;
  public hourRates = [
    { "value": 5, "text": '5' },
    { "value": 10, "text": '10' },
    { "value": 15, "text": '15' },
    { "value": 20, "text": '20' },
    { "value": 25, "text": '25' },
    { "value": 30, "text": '30' },
    { "value": 35, "text": '35' },
    { "value": 40, "text": '40' },
    { "value": 45, "text": '45' },
    { "value": 50, "text": '50' },
    { "value": 55, "text": '55' },
    { "value": 60, "text": '60' },
    { "value": 65, "text": '65' },
    { "value": 70, "text": '70' },
    { "value": 75, "text": '75' },
    { "value": 80, "text": '80' },
    { "value": 85, "text": '85' },
    { "value": 90, "text": '90' },
    { "value": 95, "text": '95' },
    { "value": 100, "text": '100' }
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

  //TODO post-<snip><snip> RE registration is: add back currency
  //In V2, but it must be done correctly next time with calculated pre-conversions
  //or maybe even plugged into an AI bot that knows the forex
  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private storage: Storage) {
    this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Editing Account...'
    });

    this.form1Values = navParams.get("form1Value");
    this.form2Values = navParams.get("form2Value");
    this.partOfSchool = navParams.get("partOfSchool");
    this.userRole = navParams.get("userRole");

    if (this.userRole == 'teacher') {
      this.EditProfilestep3Form = new FormGroup({
        teacherCvCerts: new FormControl(''),
        prefLocation: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
      })
    } else {
      this.EditProfilestep3Form = new FormGroup({
        prefLocation: new FormControl('', Validators.required)
      })
    }

    this.storage.get("UserProfile").then(roleProfile => {
      console.log(roleProfile);
      this.userData = roleProfile.userData;
      this.startDate = roleProfile.specificUser.defaultStartDate;
      this.endDate = roleProfile.specificUser.defaultEndDate;
      this.startTime = roleProfile.specificUser.defaultStartTime;
      this.endTime = roleProfile.specificUser.defaultEndTime;
      this.prefLocation = roleProfile.profileData.prefLocation;
      this.hourlyRate = roleProfile.profileData.prefPayRate;
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

  getRole() {
    return this.userRole;
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

    if (this.userRole == 'teacher') {
      this.body = {
        role: this.userRole,
        userData: this.userData,
        password: this.form1Values.password,
        editables: {
          username: this.form2Values.username.toLowerCase(),
          email: this.form2Values.email.toLowerCase(),
          profile: {
            profileabout: this.form2Values.profileAbout,
            profiletitle: this.form2Values.profileTitle,
            prefpayrate: this.hourlyRate,
            phone: this.form2Values.phone,
            fullname: this.form2Values.name,
            preflocation: form3Values.prefLocation,
          },
          specificUser: {
            yrsexperience: this.yearExperience,
            profiletitle: this.form2Values.profileTitle,
            defstartdate: this.startDate,
            defenddate: this.endDate,
            defstarttime: form3Values.startTime,
            defendtime: form3Values.endTime
          }
        }
      }
    } else if (this.userRole == 'student' || this.userRole == 'parent') {
      this.body = {
        role: this.userRole,
        userData: this.userData,
        password: this.form1Values.password,
        editables: {
          username: this.form2Values.username.toLowerCase(),
          email: this.form2Values.email.toLowerCase(),
          profile: {
            profileabout: this.form2Values.profileAbout,
            profiletitle: this.form2Values.profileTitle,
            prefpayrate: this.hourlyRate,
            phone: this.form2Values.phone,
            fullname: this.form2Values.name,
            preflocation: form3Values.prefLocation,
            schoolname: this.form2Values.othersSchoolName,
          },
          specificUser: {              
            partofschool:
              (this.form2Values.othersSchoolName ? true : false)
          }
        }
      }
    } else { // school
      this.body = {
        role: this.userRole,
        userData: this.userData,
        password: this.form1Values.password,
        editables: {
          username: this.form2Values.username.toLowerCase(),
          email: this.form2Values.email.toLowerCase(),
          profile: {
            profileabout: this.form2Values.profileAbout,
            profiletitle: this.form2Values.profileTitle,
            prefpayrate: this.hourlyRate,
            phone: this.form2Values.phone,
            fullname: this.form2Values.name,
            preflocation: form3Values.prefLocation,
          },
          specificUser: {
            schoolname: this.form2Values.schoolName,
            contactname: this.form2Values.contactName,
            contactposition: this.form2Values.contactPosition
          }
        }
      }
    }

    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'editUser',
        this.body
      );
      interface Response {
        result: any;
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
        console.log(response.result);
        this.smartieApi.updateUserProfileStorage(response.result.profileData, response.result.specificUserData).then(profile => {
          this.loading.dismiss();
          this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.userRole, fromWhere: "editProfile" });
        });
      })
    })

    /*return new Promise(resolve => {
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(res => {
          console.log(res);
          // TODO: save new mega teacherUserProfile object to localstorage
          localStorage.setItem(`${this.userRole}UserProfile`, Object.keys(res)['result']);

          // now save the Parse.User since we are auth'd only here
          // NB: this is only impossible due to opensrc Parse user save
          /*
          Parse.User.logIn(userData.username, this.form1Values.password, {
            success: user => {
              console.log('logIn success');
              user.set("username", this.form1Values.username);  // attempt to change username
              user.set("email", this.form1Values.email);
              console.log('reset members?');
              user.save({sessionToken: user.get('sessionToken'), useMasterKey: true}).then(user => {
                console.log(`W00t saved ${user}`);
              });
            }, error: (err) => {

            }
          });
          

          let cvPromises = [];
          // console.log(this.TeacherFiles);
          if(this.TeacherFiles){
            for(let cvFile of this.TeacherFiles){
              cvPromises.push(this.setTeacherCred(JSON.parse(localStorage.getItem('teacherUserProfile')).specificUser.objectId, cvFile).then((responseResult) => {
                console.log(responseResult);
              }).catch((rejectResult) => {
                console.log(rejectResult);
              }))
            }

            // finish all of the array of promises,
            // then setProfilePic()
            Promise.all(cvPromises).then(()=>{
              this.setProfilePic().then((pictureResolve) => {
                this.navCtrl.push("TotlesSearch", {role: this.userRole, fromwhere: 'editProfile'});
                this.loading.dismiss();
              }).catch((pictureReject) => {
                // TODO: do something in a modal?
                console.log(pictureReject);
              });
            })
          }else{
            this.setProfilePic().then((pictureResolve) => {
              this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.userRole, fromWhere: "editProfile" });
              this.loading.dismiss();
            }).catch((pictureReject) => {
              // TODO: do something in the UX here!!
              console.log(pictureReject);
            });
          }
        },
        err => {
          let alert;
          if (err.status == 400) {
            alert = this.alertCtrl.create({
              title: 'Edit Failed !',
              subTitle: err.error.error,
              buttons: ['OK']
            });
          } else { // Parse errs, 100-399
            alert = this.alertCtrl.create({
              title: 'Edit Failed !',
              subTitle: err.message,
              buttons: ['OK']
            });
          }

          this.submitInProgress = false;
          this.loading.dismiss();
          alert.present();
        }
      )
    });*/
  }

  setProfilePic() {
    return new Promise(function(resolve, reject){
      if(localStorage.getItem('profilePhotoDataUrl') == null){
        resolve('success');
      }else{
        let parseFile = new Parse.File('photo.jpg', {base64: localStorage.getItem('profilePhotoDataUrl')});
        parseFile.save().then((file) => {
          let roledUserProfile = JSON.parse(localStorage.getItem(`${this.userRole}UserProfile`));
          let profileId = roledUserProfile.profile.objectId;
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
    console.log(typeof rate);
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }
}
