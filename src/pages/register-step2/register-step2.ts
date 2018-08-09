import { Device } from '@ionic-native/device';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Slides, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
// import { Crop } from '@ionic-native/crop';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SmartieAPI } from '../../providers/api/smartie';
import { Response } from '../../providers/data-model/data-model';

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
  private profilePicSrc:string;
  public schoolPicSrc:string = './assets/img/school-img.png';
  private cameraData: string;
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
  private userInfo: any = { prefLocation: '', prefPayRate: ''};

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private camera: Camera, private storage: Storage, private loadingCtrl: LoadingController, private analytics : AnalyticsProvider, private smartieApi: SmartieAPI, private device: Device, private alertCtrl: AlertController,  private dbService:DbserviceProvider) {
    this.analytics.setScreenName("Register-step2");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step2", "View"));

    this.form1Values = navParams.data.form1Values;
    this.role = navParams.data.role;
    this.profilePicSrc = './assets/img/user-img-'+this.role+'.png';
    this.partOfSchool = false;

    if(this.role == 'school'){
      this.titlePlaceHolder = "School seeking CMRA";
      this.messagePlaceHolder = "We looking for Market Research Analyst, who have hands of experience in CMRA for our school";
      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        schoolName: new FormControl('', Validators.required),
        contactName: new FormControl('', Validators.required),
        contactPosition: new FormControl('', Validators.required)
      })
    }else if(this.role == 'student' || this.role == 'parent'){
      this.nextText = "Submit";
      if(this.role == 'parent'){
        this.titlePlaceHolder = "Parent seeking CMRA";
        this.messagePlaceHolder = "I'm a Parent looking for experienced Market Research Analyst for my child";
      }else{
        this.titlePlaceHolder = "Student seeking CMRA";
        this.messagePlaceHolder = "I'm a student interested in learning Market Research Analyst and looking for experienced instructor";
      }
      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        prefLocation: new FormControl('', Validators.required),
        // associateSchoolName: new FormControl('')
      })
    }else{
      this.nextText = "Next";
      this.titlePlaceHolder = "I am a Certified TOEFL Instructor";
      this.messagePlaceHolder = "Although I am certified in TOEFL I also have a passion for teaching Korean. Please book a session with me, you'll be amazed at the quick learning results!";
      this.Step2Form = new FormGroup({
        name: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required)
      })
    }


    /*if (this.globalization == undefined) {
      this.globalization.getLocaleName().then((locale) => {
        let LangAPI = this.smartieApi.getApi(
          'getNationalLanguages',
          { country: locale.value.split('-')[1] }
        );

        return new Promise(resolve => {
          interface Response {
            result: any;
          };
          this.smartieApi.http.post<Response>(LangAPI.apiUrl, LangAPI.apiBody, LangAPI.apiHeaders).subscribe(res => {
          })
        })
      }).catch((error: any) => {
        console.log(error);
      });
    } else {
    }*/
  }

  /* public filterpartOfSchool(result: string): void {
    // Handle what to do when a category is selected
    if(result){
      this.Step2Form.get('associateSchoolName').setValidators([Validators.required]);
    }else{
      this.Step2Form.get('associateSchoolName').setValidators([]);
    }
    this.partOfSchool = result;
  } */

  chooseUploadType(inputEvent, photoFor){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How you like to upload your photos',
      buttons: [
        {
          text: 'Take Picture',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            var options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              allowEdit: true,
              targetWidth: 500,
              targetHeight: 500,
              quality: 100
            };
            this.camera.getPicture(options).then((imageData) => {
              if(photoFor == 'prof'){
                // console.log(imageData);
                this.cameraData = 'data:image/jpeg;base64,' + imageData;
                // localStorage.setItem('profilePhotoDataUrl', this.profileCameraData);
                this.storage.set('profilePhotoDataUrl', imageData);
                this.photoTaken = true;
                this.photoSelected = false;
              }else if(photoFor == 'school'){
                this.schoolCameraData = 'data:image/jpeg;base64,' + imageData;
                // localStorage.setItem('schoolPhotoDataUrl', this.schoolCameraData);
                this.storage.set('schoolPhotoDataUrl', imageData);
                this.schoolPhotoTaken = true;
                this.schoolPhotoSelected = false;
              }
            }, (err) => {
            // Handle error
              console.log(err);
            });
          }
        },{
          text: 'Open Gallery',
          role: 'openGallery',
          icon: 'image',
          handler: () => {
            let options = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              allowEdit: true,
              targetWidth: 500,
              targetHeight: 500,
              quality: 75
            };

            this.camera.getPicture(options).then((imageData) => {
             // imageData is either a base64 encoded string or a file URI
             // If it's base64:
              if(photoFor == 'prof'){
                this.cameraUrl = "data:image/jpeg;base64," + imageData;
                this.storage.set('profilePhotoDataUrl', imageData);
                this.photoSelected = true;
                this.photoTaken = false;
              }else if(photoFor == 'school'){
                this.schoolCameraUrl = "data:image/jpeg;base64," + imageData;
                // localStorage.setItem('schoolPhotoDataUrl', this.schoolCameraUrl);
                this.storage.set('schoolPhotoDataUrl', imageData);
                this.schoolPhotoSelected = true;
                this.schoolPhotoTaken = false;
              }
            }, (err) => {
             // Handle error
             console.log(err);
            });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    console.log(typeof rate);
    this.hourlyRate = rate;
  }

  updateUserToProvision = async (userId, userProfileId) => {

    let API = await this.smartieApi.getApi(
      'addUserToProvision',
      { uuid: this.device.uuid, userId: userId, profileId: userProfileId}
    );


    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(response => {
      console.log("Getting updated provision");
      console.log(response);
      this.smartieApi.updateProvisionStorage(response.result);
    }, err => {
      console.log(err);
    });
  }

  next(form2Values){
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      dismissOnPageChange: true
    });
    loading.present();

    if(this.role == 'student' || this.role == 'parent'){
      // TODO need to submit data here for students
      console.log("Students registration comes here");
      console.log(this.userLocation);
      console.log(this.hourlyRate);
      this.userInfo.prefLocation = this.userLocation;
      this.userInfo.prefPayRate = this.hourlyRate;

      return new Promise(async (resolve) => {
        let API = await this.smartieApi.getApi(
          'signUpRole',
          {role: this.role, accountInfo: JSON.stringify(this.form1Values), profileInfo: JSON.stringify(form2Values), userInfo: JSON.stringify(this.userInfo)}
        );
        console.log(API);
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(signupResult => {
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
                this.smartieApi.sanitizeNotifications(Notifications.result).then(notifications => {
                  this.navCtrl.setRoot("TabsPage", { tabIndex: 0, tabTitle: "SmartieSearch", role: this.role, fromWhere: "signUp" });
                  //this.navCtrl.push("SmartieSearch", { role: this.role, fromWhere: 'signUp', loggedProfileId: signupResult.result.profileData.objectId, notifications: notifications });
                })
              }, err => {
                console.log(err);
              });
            });
          })
        }, err => {
          let alert = this.alertCtrl.create({
            title: 'Signup Failed!',
            subTitle: JSON.stringify(err),
            buttons: ['OK']
          });
          alert.present();
        })
      })
    }else{
      this.navCtrl.push("RegisterStep3Page", { form1Values : this.form1Values, form2Values : form2Values, role: this.role });
    }
    this.navCtrl.push("RegisterStep3Page", { form1Values : this.form1Values, form2Values : form2Values, role: this.role });
    this.dbService.getRegistrationData().then((res)=>{
      if(res){
        res.step = 2;
        res.form2Values = form2Values;
        this.dbService.setRegistrationData(res);
      }else{
        this.dbService.setRegistrationData({ form1Values : this.form1Values, form2Values : form2Values, role: this.role });
      }
    })
  }

  ionViewDidLoad() {

    this.storage.get('currentPosition').then(userCurrentLocation => {
      console.log(userCurrentLocation);
    });
    if(this.role == 'student'){
      // console.log('ionViewDidLoad RegisterStep2Page');
      console.log('ionViewDidLoad RegisterStep3Page');
      let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
      let options = { componentRestrictions: {country: 'us'} };

      let autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        console.log(place.formatted_address);
        console.log(place);
        this.userLocation = place.formatted_address;
      })
    }
  }

}
