import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';

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
  private formBuilder: FormBuilder;

  public languages = [{
      langid: 1,
      name: "English",
      value: "englsh"
    }, {
      langid: 2,
      name: "Thai",
      value: "thai"
    }, {
      langid: 3,
      name: "Chinese",
      value: "chinese"
    }, {
      langid: 4,
      name: "Japanese",
      value: "japanese"
    },{
      langid: 5,
      name: "French",
      value: "french"
    }];

  public levels = [{
    "name": "K",
    "value": "k"
  }, {
    "name": "Primary",
    "value": "primary"
  }, {
    "name": "High School",
    "value": "highSchool"
  },{
    "name": "University",
    "value": "university"
  }];

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController) {

    function dateValidator(c: AbstractControl){
      return c.get('startDate').value < c.get('endDate').value ? null : { 'dateGreater' : true };
    }

    function timeValidator(c: AbstractControl){
      return c.get('startTime').value < c.get('endTime').value ? null : { 'timeGreater' : true };
    }


    this.form1Values = navParams.data.form1Value;
    this.form2Values = navParams.data.form2Value;

    this.Teacherstep3Form = new FormGroup({
      teacherLanguage: new FormArray([
        new FormControl('', Validators.required),
      ]),
      teacherLevel: new FormArray([
        new FormControl('', Validators.required),
      ]),
    })
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
      {role: 'teacher', username: this.form1Values.username, password: this.form1Values.passwords.password, email: this.form1Values.email, fullname: this.form1Values.name, phone: this.form1Values.phone, age: this.form1Values.age, nativelang: this.form1Values.native, nationality: this.form1Values.nationality, profiletitle: this.form1Values.profileTitle, profileabout: this.form1Values.teacherMessage, expertlangs: this.form2Values.teacherLanguage, levelscapable: this.form2Values.teacherLevel, yrsexperience: form3Values.experience, preflocation: form3Values.prefLocation, prefpayrate: form3Values.prefPayRate, defstartdate: form3Values.startDate, defenddate: form3Values.endDate, defstarttime: form3Values.startTime, defendtime: form3Values.endTime, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("teacherSignupUserProfile", JSON.stringify(signupResult.result));

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

  setProfilePic() {
    return new Promise(function(resolve, reject){
      if(localStorage.getItem('profilePhotoDataUrl') == null){
        resolve('success');
      }else{
        let parseFile = new Parse.File('photo.jpg', {base64: localStorage.getItem('profilePhotoDataUrl')});
        parseFile.save().then((file) => {
          let teacherSignupUserProfile = JSON.parse(localStorage.getItem("teacherSignupUserProfile"));
          let profileId = teacherSignupUserProfile.profile.objectId;
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
