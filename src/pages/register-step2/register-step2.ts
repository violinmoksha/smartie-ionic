import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Slides, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
// import { Crop } from '@ionic-native/crop';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private camera: Camera, private storage: Storage, private loadingCtrl: LoadingController, private analytics : AnalyticsProvider, private dbService:DbserviceProvider) {
    this.analytics.setScreenName("Register-step2");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step2", "View"));

    this.form1Values = navParams.data.form1Value;
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
        associateSchoolName: new FormControl('')
      })
    }else{
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

  public filterpartOfSchool(result: string): void {
    // Handle what to do when a category is selected
    if(result){
      this.Step2Form.get('associateSchoolName').setValidators([Validators.required]);
    }else{
      this.Step2Form.get('associateSchoolName').setValidators([]);
    }
    this.partOfSchool = result;
  }

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

  next(form2Values){
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      dismissOnPageChange: true
    });
    loading.present();

    if(this.role == 'student' || this.role == 'parent'){
      form2Values.partOfSchool = this.partOfSchool;
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
    // console.log('ionViewDidLoad RegisterStep2Page');
  }

}
