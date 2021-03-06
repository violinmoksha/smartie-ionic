import { CameraServiceProvider } from './../../providers/camera-service';
import { FileUploaderProvider } from './../../providers/file-uploader';
import { IonicPage } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Slides, LoadingController } from 'ionic-angular';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { UtilsProvider } from '../../providers/utils';
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { AnalyticsProvider } from '../../providers/analytics';

declare let google;

/**
 * Generated class for the EditProfileStep3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() @Component({
  selector: 'page-edit-profile-step3',
  templateUrl: 'edit-profile-step3.html',
})
export class EditProfileStep3Page {

  private userRole: string;
  public submitInProgress: boolean;
  private loading: any;
  private EditProfilestep3Form: FormGroup;
  private form1Values: any;
  private form2Values: any;
  @ViewChild(Slides) hourRate: Slides;
  private hourlyRate: any;
  // teacher-specific
  @ViewChild(Slides) yearExp: Slides;
  public TeacherFiles: any;
  public TeacherFilesView: any;
  public fileData: any;
  private yearExperience: any;
  private startDate: any;
  private endDate: any;
  private startTime: any;
  private endTime: any;
  private userData: any;
  private body: any;
  timeZone: any;
  yrsExperience: any;
  public cvFiles: Array<any> = [];
  public uploadedCvFiles: Array<any> = []
  public partOfSchool: boolean;
  public prefLocation: string;
  // public userLocation:any;
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
    { "text": '100', "value": 100 },
    { "text": '105', "value": 105 },
    { "text": '110', "value": 110 },
    { "text": '115', "value": 115 },
    { "text": '120', "value": 120 },
    { "text": '125', "value": 125 },
    { "text": '130', "value": 130 },
    { "text": '135', "value": 135 },
    { "text": '140', "value": 140 },
    { "text": '145', "value": 145 },
    { "text": '150', "value": 150 },
    { "text": '155', "value": 155 },
    { "text": '160', "value": 160 },
    { "text": '165', "value": 165 },
    { "text": '170', "value": 170 },
    { "text": '175', "value": 175 },
    { "text": '180', "value": 180 },
    { "text": '185', "value": 185 },
    { "text": '190', "value": 190 },
    { "text": '195', "value": 195 },
    { "text": '200', "value": 200 },
    { "text": '205', "value": 205 },
    { "text": '210', "value": 210 },
    { "text": '215', "value": 215 },
    { "text": '220', "value": 220 },
    { "text": '225', "value": 225 },
    { "text": '230', "value": 230 },
    { "text": '235', "value": 235 },
    { "text": '240', "value": 240 },
    { "text": '245', "value": 245 },
    { "text": '250', "value": 250 }
  ];

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

  //TODO post-<snip><snip> RE registration is: add back currency
  //In V2, but it must be done correctly next time with calculated pre-conversions
  //or maybe even plugged into an AI bot that knows the forex
  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private storage: Storage, private analytics: AnalyticsProvider, public fileUploader: FileUploaderProvider, public cameraService: CameraServiceProvider, private utilsService: UtilsProvider) {
    this.analytics.setScreenName("EditProfile_step2");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("EditProfile_step2", "View"));

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
      this.userData = roleProfile.userData;
      this.prefLocation = roleProfile.profileData.prefLocation;
      this.hourlyRate = roleProfile.profileData.prefPayRate;
      this.yearExperience = roleProfile.specificUser.yrsExperience;
      let availStartDateTime = new Date(roleProfile.specificUser.defaultStartDateTime.iso);
      let availEndDateTime = new Date(roleProfile.specificUser.defaultEndDateTime.iso);

      this.timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

      this.startTime = this.utilsService.formatTime(availStartDateTime);
      this.endTime = this.utilsService.formatTime(availEndDateTime);

      this.startDate = availStartDateTime.getDate() + '-' + (availStartDateTime.getMonth() + 1) + '-' + availStartDateTime.getFullYear();
      this.endDate = availEndDateTime.getDate() + '-' + (availEndDateTime.getMonth() + 1) + '-' + availEndDateTime.getFullYear();
      for (var i = 0; i < roleProfile.specificUser.credentials.length; i++) {
        this.uploadedCvFiles.push({ name: "File" + i, data: roleProfile.specificUser.credentials[i] });
      }
    });
  }

  ionViewDidLoad(){
    let input = document.getElementById("locationSearchEdit").getElementsByTagName('input')[0];
    let autoCompleteOptions = { componentRestrictions: { country: 'us' } };

    let autocomplete = new google.maps.places.Autocomplete(input, autoCompleteOptions);
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      this.prefLocation = place.formatted_address;
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
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date) {
        this.startDate = date.date + '-' + date.months + '-' + date.years;
      }
    })
  }

  endDateCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
    };
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date) {
        this.endDate = date.date + '-' + date.months + '-' + date.years;
      }
    })
  }

  public filterYear(years: number): void {
    // Handle what to do when a category is selected
    this.yearExperience = years;
  }

  getRole() {
    return this.userRole;
  }

  uploadCv() {
    this.cameraService.getImage().then(async (files) => {
      if (Array.isArray(files)) {
        for (let file of files) {
          this.cvFiles.push({ 'name': await this.cameraService.getFileName(), 'data': file });
        }
      } else {
        this.cvFiles.push({ 'name': await this.cameraService.getFileName(), 'data': files });
      }
    }, (err) => {
      console.log(err);
    })
  }

  removeFile(i) {
    this.cvFiles.splice(i, 1);
  }

  removeUploadedFile(i) {
    this.uploadedCvFiles.splice(i, 1);
  }

  uploadToFirebaseBucket(files, bucketName) {
    return new Promise((resolve, reject) => {
      let filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(this.fileUploader.uploadToFCS(files[i].data.imageUrl, bucketName));
      }
      Promise.all(filePromises).then((results) => {
        resolve(results);
      })
    })
  }

  signupRole(form3Values) {
    form3Values.credentials = [];
    this.loading.present();
    if (this.cvFiles.length > 0 && this.userRole == "teacher") {
      this.uploadToFirebaseBucket(this.cvFiles, 'Credentials').then(res => {
        if (this.uploadedCvFiles.length > 0) {
          for (var i = 0; i < this.uploadedCvFiles.length; i++) {
            form3Values.credentials.push(this.uploadedCvFiles[i].data);
          }
        }
        form3Values.credentials = form3Values.credentials.concat(res);
        this.finalEditProfileSubmit(form3Values);
      }, err => {
        console.log(err);
      })
    } else {
      for (var i = 0; i < this.uploadedCvFiles.length; i++) {
        form3Values.credentials.push(this.uploadedCvFiles[i].data);
      }
      this.finalEditProfileSubmit(form3Values);
    }
  }

  finalEditProfileSubmit(form3Values) {
    try{
      this.submitInProgress = true;
      this.loading.present();

      if (this.userRole == 'teacher') {

        let selectedStartDate = this.startDate.split('-');
        let selectedEndDate = this.endDate.split('-');
        let selectedStartTime = this.startTime.split('T')[1];
        let selectedEndTime = this.endTime.split('T')[1];

        let UTCstartTime = new Date(selectedStartDate[2], selectedStartDate[1] - 1, selectedStartDate[0], parseInt(selectedStartTime.split(':')[0]), parseInt(selectedStartTime.split(':')[1]));

        let UTCendTime = new Date(selectedEndDate[2], selectedEndDate[1] - 1, selectedEndDate[0], parseInt(selectedEndTime.split(':')[0]), parseInt(selectedEndTime.split(':')[1]));

        this.body = {
          role: this.userRole,
          userData: this.userData,
          password: this.form1Values.password,
          editables: {
            username: this.form2Values.username.toLowerCase(),
            email: this.form2Values.email.toLowerCase(),
            profile: {
              profileAbout: this.form2Values.profileAbout,
              profileTitle: this.form2Values.profileTitle,
              prefPayRate: this.hourlyRate,
              phone: this.form2Values.phone,
              fullname: this.form2Values.name,
              prefLocation: form3Values.prefLocation,
              profilePhoto: this.form2Values.profilePhoto
            },
            specificUser: {
              yrsExperience: this.yearExperience,
              profileTitle: this.form2Values.profileTitle,
              defaultStartDateTime: UTCstartTime.toISOString(),
              defaultEndDateTime: UTCendTime.toISOString(),
              credentials: form3Values.credentials
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
              profileAbout: this.form2Values.profileAbout,
              profileTitle: this.form2Values.profileTitle,
              prefPayRate: this.hourlyRate,
              phone: this.form2Values.phone,
              fullname: this.form2Values.name,
              prefLocation: form3Values.prefLocation,
              schoolname: this.form2Values.othersSchoolName,
              profilePhoto: this.form2Values.profilePhoto
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
              profileAbout: this.form2Values.profileAbout,
              profileTitle: this.form2Values.profileTitle,
              prefPayRate: this.hourlyRate,
              phone: this.form2Values.phone,
              fullname: this.form2Values.name,
              prefLocation: form3Values.prefLocation,
              profilePhoto: this.form2Values.profilePhoto
            },
            specificUser: {
              schoolname: this.form2Values.schoolName,
              contactname: this.form2Values.contactName,
              contactposition: this.form2Values.contactPosition
            }
          }
        }
      }
    }catch(e){
      console.log(e);
    }

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'editUser',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          this.loading.dismiss();
          this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.userRole, fromWhere: "editProfile" });
          this.dataService.updateUserProfileStorage(response.result.profileData, response.result.specificUserData);
        }, err => {
          this.loading.dismiss();
        })
      });
    })
  }

  onChangeLevel(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.EditProfilestep3Form.controls.teacherLevel;

    if (isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed

}
