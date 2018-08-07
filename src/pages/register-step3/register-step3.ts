import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { CameraServiceProvider } from './../../providers/camera-service/camera-service';
import { Device } from '@ionic-native/device';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController, LoadingController  } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { Storage } from '@ionic/storage';
import {Response} from '../../providers/data-model/data-model';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
declare let google;

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
  private startDate: any;
  private endDate: any;
  private role: any;
  private today: any;
  public userLocation: any;
  public cvFiles:Array<any>=[]

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
    { "value": 20, "text": '20 +' }
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, private storage: Storage, private device: Device,private analytics : AnalyticsProvider,private cameraService : CameraServiceProvider, private dbService:DbserviceProvider ) {    // this.submitInProgress = false;

    this.analytics.setScreenName("Register-step3");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step3", "View"));

    this.loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });
    console.log("*** nav params reg 3***")
    console.log(navParams);
    this.form1Values = navParams.data.form1Values;
    this.form2Values = navParams.data.form2Values;
    this.role = navParams.data.role;

    this.today = new Date();
    this.startDate = this.today.getMonth()+1 +'-'+this.today.getDate()+'-'+this.today.getFullYear();
    var defEndDate = new Date(this.today.setDate(this.today.getDate() + 365));
    this.endDate = defEndDate.getMonth()+1 +'-'+defEndDate.getDate()+'-'+defEndDate.getFullYear();

    /* let timeZoneStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 10, 0, 0);
    console.log(timeZoneStartTime);
    this.event.timeStarts = timeZoneStartTime.toLocaleTimeString();

    console.log(this.event.timeStarts);

    let timeZoneEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 23, 0, 0);
    console.log(timeZoneEndTime);
    this.event.timeEnds = timeZoneEndTime.toLocaleTimeString();

    console.log(this.event.timeEnds); */

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


  updateUserToProvision = async (userId, userProfileId) => {

    let API = await this.smartieApi.getApi(
      'addUserToProvision',
      { uuid: this.device.uuid, userId: userId, profileId: userProfileId}
    );


    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
      console.log("Getting updated provision");
      console.log(response);
    }, err => {
      console.log(err);
    });
  }

  finalRegisterSubmit(form3Values){
    // this.submitInProgress = true;
    this.loading.present();

    if(this.cvFiles.length>0)
    this.storage.set('teacherCreds', this.cvFiles);

    form3Values.prefPayRate = this.hourlyRate;
    if(this.role == 'teacher'){
      form3Values.yrsExperience = this.yearExperience;

      let UTCstartTime = new Date(this.startDate.split('-')[2], (this.startDate.split('-')[0] - 1), this.startDate.split('-')[1], parseInt(form3Values.startTime.split(':')[0]), parseInt(form3Values.startTime.split(':')[1]));

      form3Values.defaultStartDateTime = UTCstartTime;

      // form3Values.defaultUTCStartTime = UTCstartTime.getUTCHours()+':'+UTCstartTime.getUTCMinutes();

      let UTCendTime = new Date(this.endDate.split('-')[2], (this.endDate.split('-')[0] - 1), this.endDate.split('-')[1], parseInt(form3Values.endTime.split(':')[0]), parseInt(form3Values.endTime.split(':')[1]));

      form3Values.defaultEndDateTime = UTCendTime;

      //Setting prefLocation from google autocomplete places
      form3Values.prefLocation = this.userLocation;

      console.log(form3Values);

      // form3Values.defaultUTCEndTime = UTCendTime.getUTCHours()+':'+UTCendTime.getUTCMinutes();
    }


    return new Promise(async (resolve) => {
      let API = await this.smartieApi.getApi(
        'signUpRole',
        {role: this.role, accountInfo: JSON.stringify(this.form1Values), profileInfo: JSON.stringify(this.form2Values), userInfo: JSON.stringify(form3Values)}
      );

      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          console.log(signupResult);
          this.updateUserToProvision(signupResult.result.userData.objectId, signupResult.result.profileData.objectId);

          this.storage.set("UserProfile", signupResult.result).then(() => {
            return new Promise(async (resolve) => {
              let API = await this.smartieApi.getApi(
                'fetchMarkers',
                { profileId: signupResult.result.profileData.objectId, role: this.role }
              );

              interface Response {
                result: any
              };
              this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(Notifications => {
                this.loading.dismiss();
                this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                  this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, fromWhere: "signUp" });
                  //this.navCtrl.push("SmartieSearch", { role: this.role, fromWhere: 'signUp', loggedProfileId: signupResult.result.profileData.objectId, notifications: notifications });
                  this.dbService.setRegistrationData({step:3, role: this.role, form3: form3Values})
                })
              }, err => {
                console.log(err);
              });
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
    let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
    let options = { componentRestrictions: {country: 'us'} };

    let autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place.formatted_address);
      this.userLocation = place.formatted_address;
    })
  }

  uploadCv(){
    this.cameraService.getImage().then((files)=>{
      console.log(files);
      if(Array.isArray(files)){
        for(let file of files){
          this.getBase64(file).then((obj)=>{
            this.cvFiles.push({'name':obj['name'], 'data':obj['data']});
          })
        }
      }else{
        this.getBase64(files).then((obj)=>{
          this.cvFiles.push({'name':obj['name'], 'data':obj['data']});
        })
      }
    })
  }

}
