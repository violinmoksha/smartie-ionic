import { FileUploaderProvider } from './../../providers/file-uploader';
import { CameraServiceProvider } from './../../providers/camera-service';
import { Device } from '@ionic-native/device';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, Slides, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
import { DataService } from '../../app/app.data';
import { FetchiOSUDID } from '../../providers/fetch-ios-udid';

declare let google;
/**
 * Generated class for the RegisterStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-step2',
  templateUrl: 'register-step2.html',
})
export class RegisterStep2Page {

  private Step2Form: FormGroup;
  private form1Values: any;
  private role: any;
  private profilePicSrc: string;
  public schoolPicSrc: string = './assets/img/school-img.png';
  private cameraData: string;
  public displayCameraImg: string;
  private schoolCameraData: string;
  private photoTaken: boolean;
  private schoolPhotoTaken: boolean;
  private cameraUrl: string;
  private schoolCameraUrl: string;
  private photoSelected: boolean;
  private schoolPhotoSelected: boolean;
  private partOfSchool: any;
  private titlePlaceHolder: string;
  private messagePlaceHolder: string;
  @ViewChild(Slides) studentSchool: Slides;
  @ViewChild(Slides) hourRate: Slides;
  private hourlyRate: any;
  public userLocation: any;
  public nextText: string = '';
  private userInfo: any = { prefLocation: '', prefPayRate: '' };
  public licenseFiles: Array<any> = [];

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
  public loading = this.loadingCtrl.create({
    content: 'Loading...',
    dismissOnPageChange: true
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private camera: Camera, private storage: Storage, private loadingCtrl: LoadingController, private analytics: AnalyticsProvider, private dataService: DataService, private device: Device, private alertCtrl: AlertController, public cameraService:CameraServiceProvider, public fileUploader:FileUploaderProvider, public platform:Platform, public UDID: FetchiOSUDID) {
    this.analytics.setScreenName("Register-step2");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step2", "View"));

    this.form1Values = navParams.data.form1Values;
    this.role = navParams.data.role;
    this.profilePicSrc = './assets/img/user-img-' + this.role + '.png';
    this.partOfSchool = false;

    if (this.role == 'school') {
      this.titlePlaceHolder = "School seeking CMRA";
      this.messagePlaceHolder = "We looking for Market Research Analyst, who have hands of experience in CMRA for our school";
      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        contactName: new FormControl('', Validators.required),
        contactPosition: new FormControl('', Validators.required)
      })
    } else if (this.role == 'student' || this.role == 'parent') {
      this.nextText = "Submit";
      if (this.role == 'parent') {
        this.titlePlaceHolder = "Parent seeking CMRA";
        this.messagePlaceHolder = "I'm a Parent looking for experienced Market Research Analyst for my child";
      } else {
        this.titlePlaceHolder = "Student seeking CMRA";
        this.messagePlaceHolder = "I'm a student interested in learning Market Research Analyst and looking for experienced instructor";
      }

      //Checking Device location
      this.storage.get('phoneGeoposition').then(phoneGeoposition => {
        this.getGeoPlace(phoneGeoposition).then((address: any) => {
          // TODO: deal with Geoposition now as defined in Test geolocation mock, not Address
          if (address.country == 'US') {
            this.Step2Form.controls['prefLocation'].disable()
            this.userLocation = address.formattedAddress;
          }
        })
      })

      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        prefLocation: new FormControl('', Validators.required),
        // associateSchoolName: new FormControl('')
      })
    } else {
      this.nextText = "Next";
      this.titlePlaceHolder = "I am a Certified TOEFL Instructor";
      this.messagePlaceHolder = "Although I am certified in TOEFL I also have a passion for teaching Korean. Please book a session with me, you'll be amazed at the quick learning results!";
      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required)
      })
    }

  }

  chooseUploadType(inputEvent, photoFor) {
    this.cameraService.getImage().then((imageData: any) => {
        // this.cameraData = this.platform.is("ios") ? imageData[0].replace('file://', '') : imageData[0];
        this.cameraData = imageData.imageUrl;
        this.displayCameraImg = imageData.normalizedUrl
        this.storage.set('profilePhotoDataUrl', imageData[0]);
        this.photoTaken = true;
        this.photoSelected = false;
    });
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    // TODO: never used!
    //let currentIndex = this.hourRate.getActiveIndex();
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    this.hourlyRate = rate;
  }

  updateUserToProvision = async (userId, userProfileId) => {
    this.UDID.getDeviceId().then(async udid => {
      return await this.dataService.getApi(
        'addUserToProvision',
        { uuid: udid, userId: userId, profileId: userProfileId }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
          // TODO: needs to happen right here directly into storage?
          return await this.storage.set('Provision', response.result).then(async prov => {
            return await prov;
          })
        }, err => {
          console.log(err);
        });
      });
    });
  }

  submitStep2(form2Values) {

    this.loading.present();

    if(this.cameraData || this.schoolCameraData){
      var uploadContent = null;
      if(this.cameraData){
        uploadContent = this.cameraData;
      }else if(this.schoolCameraData){
        uploadContent = this.schoolCameraData;
      }
      this.fileUploader.uploadFileToAWS(uploadContent).then(res => {
        form2Values.profilePhoto = res;
        this.next(form2Values);
      })
    }else{
      this.next(form2Values);
    }
  }

  next(form2Values) {
    if (this.role == 'student' || this.role == 'parent') {
      // TODO need to submit data here for students
      this.userInfo.prefLocation = this.userLocation;
      this.userInfo.prefPayRate = this.hourlyRate;

    //  if(this.licenseFiles.length > 0){
        // this.uploadToS3(this.licenseFiles, this.fileUploader.awsBucket.drivingLicense).then(license => {
          // form2Values.drivingLicense = license;
          this.dataService.getApi(
             'signUpRole',
             { role: this.role, accountInfo: JSON.stringify(this.form1Values), profileInfo: JSON.stringify(form2Values), userInfo: JSON.stringify(this.userInfo) }
           ).then(API => {
             this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async signupResult => {
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
                   }]
                 });
                 alert.present();
               } else {
                 this.storage.set("UserProfile", signupResult.result).then(() => {
                     this.dataService.getApi(
                       'fetchMarkers',
                       { profileId: signupResult.result.profileData.objectId, role: this.role }
                     ).then(async API => {
                       this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async Notifications => {
                         this.dataService.sanitizeNotifications(Notifications.result).then(async notifications => {
                           this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, fromWhere: "signUp" });
                         })
                       }, err => {
                         console.log(err);
                         // TODO: hm shud this return, find out in Unit tests
                       });
                     });
                 })
               }
             }, err => {
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
        // }, (err) => {
        //   console.log(err);
        // })
      //}//-------
    } else {
        this.loading.dismiss();
        this.navCtrl.push("RegisterStep3Page", { form1Values: this.form1Values, form2Values: form2Values, role: this.role });

        this.storage.get('Registration').then(registration => {
          if (registration) {
            registration.step = 2;
            registration.form2Values = form2Values;
            this.storage.set('Registration', registration);
          } else {
            this.storage.set('Registration', { form1Values: this.form1Values, form2Values: form2Values, role: this.role });
          }
        })
    }
  }

  ionViewDidLoad() {
    if (this.role == 'student') {
      let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
      let options = { componentRestrictions: { country: 'us' } };

      let autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        this.userLocation = place.formatted_address;
      })
    }
  }

  getGeoPlace(phoneGeoposition) {

    return new Promise(resolve => {
      let latLng = new google.maps.LatLng(phoneGeoposition.coords.latitude, phoneGeoposition.coords.longitude);

      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latLng }, function (results, status) {
        let address: { country: string; formattedAddress: string; };
        for (let ac = 0; ac < results[0].address_components.length; ac++) {
          let component = results[0].address_components[ac];

          switch (component.types[0]) {
            case 'country':
              address.country = component.short_name;
              address.formattedAddress = results[0].formatted_address;
              resolve(address);
              break;
          }
        };
      })
    })
  }

  removeFile(i, source) {
    if(source == 'license')
      this.licenseFiles.splice(i,1);
  }

  uploadToS3(files, bucketName) {
    return new Promise((resolve, reject) => {
      let filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(this.fileUploader.uploadFileToAWS(files[i].data.imageUrl));
      }
      Promise.all(filePromises).then((results) => {
        resolve(results);
      })
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
