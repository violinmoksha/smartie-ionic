import { IonicPage } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Slides, LoadingController } from 'ionic-angular';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the RegisterSchoolStep3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-register-school-step3',
  templateUrl: 'register-school-step3.html',
})
export class RegisterSchoolStep3Page {

  private submitInProgress: boolean;
  private loading: any;
  private Schoolstep3Form : FormGroup;
  private form1Values: any;
  private form2Values: any;
  @ViewChild(Slides) hourRate: Slides;
  @ViewChild(Slides) curr: Slides;
  private hourlyRate: any;
  private userCurrency: any;

  /*public languages = [
    { langid: 1, name: "English", value: "englsh" },
    { langid: 2, name: "Thai", value: "thai" },
    { langid: 3, name: "Chinese", value: "chinese" },
    { langid: 4, name: "Japanese", value: "japanese" },
    { langid: 5, name: "French", value: "french" }
  ];

  public levels = [
    { "name": "K", "value": "k"},
    { "name": "Primary", "value": "primary" },
    { "name": "High School", "value": "highSchool" },
    { "name": "University", "value": "university" }
  ];*/

  public hourRates = [
    { "value": '5', "text": '5' },
    { "value": '10', "text": '10' },
    { "value": '15', "text": '15' },
    { "value": '20', "text": '20' },
    { "value": '25', "text": '25' },
    { "value": '30', "text": '30' },
    { "value": '35', "text": '35' },
    { "value": '40', "text": '40' },
    { "value": '45', "text": '45' },
    { "value": '50', "text": '50' },
    { "value": '55', "text": '55' },
    { "value": '60', "text": '60' },
    { "value": '65', "text": '65' },
    { "value": '70', "text": '70' },
    { "value": '75', "text": '75' },
    { "value": '80', "text": '80' },
    { "value": '85', "text": '85' },
    { "value": '90', "text": '90' },
    { "value": '95', "text": '95' },
    { "value": '100', "text": '100' }
  ];

  /*public currencies = [
    { "value": 'USD', "text": 'US Dollar' },
    { "value": 'EUR', "text": 'Euro' },
    { "value": 'AUD', "text": 'Aus Dollar' },
    { "value": 'INR', "text": 'Rupee' },
    { "value": 'THB', "text": 'Thai Baht' },
  ];*/

  constructor(public navCtrl: NavController, public navParams: NavParams, private smartieApi: SmartieAPI, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.submitInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });

    this.form1Values = navParams.data.form1Value;
    this.form2Values = navParams.data.form2Value;

    this.Schoolstep3Form = new FormGroup({
      // requiredLang: new FormArray([], Validators.required),
      // requiredLevel: new FormArray([], Validators.required),
      prefLocation: new FormControl('', Validators.required)
    })
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    console.log(rate);
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }

  public filterCurrency(curr: number): void {
    // Handle what to do when a category is selected
    console.log(curr);
    this.userCurrency = curr;
  }

  // Method executed when the slides are changed
  public currencyChanged(): void {
    let currentIndex = this.curr.getActiveIndex();
    console.log(currentIndex);
  }

  onChangeSchoolLanguage(name: string, isChecked: boolean) {
    const knownLanguage = <FormArray>this.Schoolstep3Form.controls.requiredLang;

    if(isChecked) {
      knownLanguage.push(new FormControl(name));
    } else {
      let index = knownLanguage.controls.findIndex(x => x.value == name)
      knownLanguage.removeAt(index);
    }
  }

  onChangeSchoolLevel(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.Schoolstep3Form.controls.requiredLevel;
    console.log(knownLevel);

    if(isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
  }

  SchoolSubmit(schoolData){
    this.submitInProgress = true;
    this.loading.present();

    let API = this.smartieApi.getApi(
      'signupSchool',
      {role: 'school', username: this.form1Values.username, password: this.form1Values.password, email: this.form1Values.email, schoolname: this.form2Values.schoolName, contactname: this.form2Values.contactName, contactposition: this.form2Values.contactPosition, phone: this.form2Values.phone, levelreq: schoolData.requiredLevel.toString(), langreq: schoolData.requiredLang.toString(), profileabout: this.form2Values.profileMessage, preflocation: schoolData.prefLocation, prefpayrate: this.hourlyRate, prefcurrency: this.userCurrency, langpref: 'en'}
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      };
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        signupResult => {
          localStorage.setItem("schoolUserProfile", JSON.stringify(signupResult.result));

          // if(localStorage.getItem('profilePhotoDataUrl') == null && localStorage.getItem('schoolPhotoDataUrl') == null ){
            this.navCtrl.push("TotlesSearch", {role: 'parent', fromwhere: 'signUp'});
          // }else{
          //   this.setProfilePic().then((pictureResolve) => {
          //     this.navCtrl.push(TotlesSearch, {role: 'parent', fromwhere: 'signUp'});
          //   }).catch((pictureReject) => {
          //     console.log(pictureReject);
          //   });
          // }

        },
        err => {
          let signupError = err.error;
          // console.log(signupError);
          let alert = this.alertCtrl.create({
            title: 'Signup Failed !',
            subTitle: signupError.error.split(':')[2].split(/[0-9]{3}\s/g)[1],
            buttons: ['OK']
          });
          alert.present();
        }
      )
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolStep3Page');
  }

}
