import { FileUploaderProvider } from './../../providers/file-uploader';
import { CameraServiceProvider } from './../../providers/camera-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController, LoadingController } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
import { FetchiOSUDID } from '../../providers/fetch-ios-udid';
import { JobRequestProvider } from '../../providers/job-request'

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

  private loading: any;
  private form1Values: any;
  private form2Values: any;
  public Step3Form: FormGroup;
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
  public cvFiles: Array<any> = []
  public licenseFiles: Array<any> = []

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
    { "value": 20, "text": '20+' },
    { "value": 21, "text": '' },
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, private storage: Storage, private analytics: AnalyticsProvider, private cameraService: CameraServiceProvider, private fileUploader: FileUploaderProvider, public UDID: FetchiOSUDID, public jobReqService: JobRequestProvider) {

    this.analytics.setScreenName("Register-step3");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step3", "View"));

    this.loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });
    this.form1Values = navParams.get("form1Values");
    this.form2Values = navParams.get("form2Values");
    this.role = navParams.get("role");

    this.today = new Date();
    this.startDate = this.today.getMonth() + 1 + '-' + this.today.getDate() + '-' + this.today.getFullYear();
    var defEndDate = new Date(this.today.setDate(this.today.getDate() + 365));
    this.endDate = defEndDate.getMonth() + 1 + '-' + defEndDate.getDate() + '-' + defEndDate.getFullYear();

    //profilePhoto
    this.storage.get('profilePhotoDataUrl').then(profilePhoto => {
      //this.form2Values.profilePhoto = profilePhoto;
    })

    if (this.role == 'teacher') {
      this.Step3Form = new FormGroup({
        teacherCvCerts: new FormControl(''),
        prefLocation: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
      })
    } else {
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
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date) {
        this.startDate = date.months + '-' + date.date + '-' + date.years;
      }
    })
  }

  endDateCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'single'
    };
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date) {
        this.endDate = date.months + '-' + date.date + '-' + date.years;
      }
    })
  }

  public filterYear(years: number): void {
    // Handle what to do when a category is selected
    this.yearExperience = years;
  }

  // Method executed when the slides are changed
    // public yearChanged(): void {
    //   let currentIndex = this.yearExp.getActiveIndex();
    // }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  // public rateChanged(): void {
  //   let currentIndex = this.hourRate.getActiveIndex();
  // }

  updateUserToProvision = async (userId, userProfileId) => {
    this.UDID.getDeviceId().then(async udid => {
      return await this.dataService.getApi(
        'addUserToProvision',
        { uuid: udid, userId: userId, profileId: userProfileId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          // TODO: have we done this correctly, we'll see, this simplification should again be correct
          this.storage.set('Provision', response.result);
          //this.dataService.updateProvisionStorage(response[0].result);
        }, err => {
          console.log(err);
        });
      });
    });
  }

  uploadToFirebaseBucket(files, bucketName) {
    return new Promise((resolve, reject) => {
      let filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(this.fileUploader.uploadToFCS(files[i].data.imageUrl, bucketName));
      }
      Promise.all(filePromises).then((results) => {
        resolve(results);
      }, err => {
        reject(err);
      })
    })
  }

  signupRole(form3Values) {
    this.loading.present();
    if(this.licenseFiles.length > 0) {
      this.uploadToFirebaseBucket(this.licenseFiles, 'DrivingLicense').then(license => {
        form3Values.drivingLicense = license;
        if (this.cvFiles.length > 0 && this.role == "teacher"){
          this.uploadToFirebaseBucket(this.cvFiles, 'Credentials').then(res => {
            form3Values.credentials = res;
            this.finalRegisterSubmit(form3Values);
          }, err => {
            console.log(err);
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'File upload Failed!',
              subTitle: JSON.stringify(err.message),
              buttons: ['OK']
            });
            alert.present();
          })
        }else{
          this.finalRegisterSubmit(form3Values);
        }
      }, (error) => {
        console.log(error);
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'File upload Failed!',
          subTitle: JSON.stringify(error.message),
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

  finalRegisterSubmit(form3Values) {
    form3Values.prefPayRate = this.hourlyRate;
    if (this.role == 'teacher') {
      form3Values.yrsExperience = this.yearExperience;

      let UTCstartTime = new Date(this.startDate.split('-')[2], (this.startDate.split('-')[0] - 1), this.startDate.split('-')[1], parseInt(form3Values.startTime.split(':')[0]), parseInt(form3Values.startTime.split(':')[1]));

      form3Values.defaultStartDateTime = UTCstartTime;

      let UTCendTime = new Date(this.endDate.split('-')[2], (this.endDate.split('-')[0] - 1), this.endDate.split('-')[1], parseInt(form3Values.endTime.split(':')[0]), parseInt(form3Values.endTime.split(':')[1]));

      form3Values.defaultEndDateTime = UTCendTime;

      //Setting prefLocation from google autocomplete places
      form3Values.prefLocation = this.userLocation;

    }
      this.dataService.getApi(
        'signUpRole',
        { role: this.role, accountInfo: JSON.stringify(this.form1Values), profileInfo: JSON.stringify(this.form2Values), userInfo: JSON.stringify(form3Values) }
      ).then(async API => {
        this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(
          async signupResult => {

            this.updateUserToProvision(signupResult.result.userData.objectId, signupResult.result.profileData.objectId);

            if (!signupResult.result.userData.emailVerified) {
              let alert = this.alertCtrl.create({
                title: 'Email not yet verified.',
                subTitle: "Please check your email to confirm your email address. Be sure to check your spam folder for our confirmation as this can happen with some email providers!",
                buttons: [{
                  text: 'Ok',
                  role: 'Ok',
                  handler: data => {
                    this.navCtrl.push("LoginPage");
                  }
                }],
                enableBackdropDismiss: false
              });
              this.loading.dismiss();
              alert.present();
            } else {
              // TODO: do this via storage now
              return await this.storage.set("UserProfile", signupResult.result).then(async () => {
                return await new Promise(async (resolve) => {
                  return await this.dataService.getApi(
                    'fetchMarkers',
                    { profileId: signupResult.result.profileData.objectId, role: this.role }
                  ).then(async API => {
                    return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
                      this.loading.dismiss();
                      return await this.jobReqService.sanitizeNotifications(Notifications.result).then(notifications => {
                        this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, fromWhere: "signUp" });
                        // TODO: do this via storage now
                        //this.dbService.setRegistrationData({step:3, role: this.role, form3: form3Values})
                      })
                    }, err => {
                      console.log(err.error.error);
                    });
                  });

                });
              });
            }
          },
          err => {
            let signUpErrorMessage = JSON.parse(err.error);
            let alert = this.alertCtrl.create({
              title: 'Signup Failed!',
              subTitle: JSON.stringify(signUpErrorMessage.error),
              buttons: ['OK']
            });
            this.loading.dismiss();
            alert.present();
          })
      });
  }

  ionViewDidLoad() {
    let input = document.getElementById("locationTeacherSearch").getElementsByTagName('input')[0];
    let options = { componentRestrictions: { country: 'us' } };

    let autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      this.userLocation = place.formatted_address;
    })
  }

  removeFile(i, source) {
    if(source == 'creds')
      this.cvFiles.splice(i, 1);
    if(source == 'license')
      this.licenseFiles.splice(i,1);
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

  uploadDL(){
    this.cameraService.getImage().then(async (license) => {
      if (Array.isArray(license)) {
        for (let lic of license) {
          this.licenseFiles.push({ 'name': await this.cameraService.getFileName(), 'data': lic });
        }
      } else {
        this.licenseFiles.push({ 'name': await this.cameraService.getFileName(), 'data': license });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
