import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { RegisterTeacherStep3 } from './../teacher-step3/teacher-step3';
import { Globalization } from '@ionic-native/globalization';
import { SmartieAPI } from '../../../providers/api/smartie';

/**
 * Generated class for the TeacherStep2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-teacher-step2',
  templateUrl: 'teacher-step2.html',
})

export class RegisterTeacherStep2 {

  private Teacherstep2Form: FormGroup;
  private form1Values: any;
  private languages: any;

  pageProfileSrc:string = './assets/img/user-img-teacher.png';
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  /*public languages = [{
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
  }];*/

  // private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController, private globalization: Globalization, private smartieApi: SmartieAPI) {
    this.form1Values = navParams.data.form1Value;

    this.Teacherstep2Form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      native: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      profileTitle: new FormControl('', Validators.required),
      profileMessage: new FormControl('', Validators.required)
    })

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
          this.languages = res.result.languages;
        })
      })
    }).catch((error: any) => {
      console.log(error);
    });
  }

  /*onChangeTeacherLanguage(name: string, isChecked: boolean) {
    const knownLanguage = <FormArray>this.Teacherstep2Form.controls.teacherLanguage;

    if(isChecked) {
      knownLanguage.push(new FormControl(name));
    } else {
      let index = knownLanguage.controls.findIndex(x => x.value == name)
      knownLanguage.removeAt(index);
    }
  }

  onChangeLevelLanguage(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.Teacherstep2Form.controls.teacherLevel;

    if(isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
  }*/

  chooseUploadType(inputEvent){
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
              destinationType: this.camera.DestinationType.DATA_URL
            };
            this.camera.getPicture(options).then((imageData) => {
              this.cameraData = 'data:image/jpeg;base64,' + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraData);
              this.photoTaken = true;
              this.photoSelected = false;
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
            console.log('Gallery clicked');
            let options = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              quality : 100
            };

            this.camera.getPicture(options).then((imageData) => {
             // imageData is either a base64 encoded string or a file URI
             // If it's base64:
              this.cameraUrl = "data:image/jpeg;base64," + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraUrl);
              // console.log(this.cameraUrl);
              this.photoSelected = true;
              this.photoTaken = false;
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

  next(form2Value){
    form2Value.languages = this.languages;
    this.navCtrl.push(RegisterTeacherStep3, { form1Value : this.form1Values, form2Value : form2Value });
  }
  // updateTeacherLanguage(event){
  //   console.log(event);
  // }

  ionViewDidLoad() {
  }

}
