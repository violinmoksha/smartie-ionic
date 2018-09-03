import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';

/**
 * Generated class for the RegisterStep1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-step1',
  templateUrl: 'register-step1.html',
})
export class RegisterStep1Page {

  private role: any;
  private Step1Form: FormGroup;
  private notNewEmail: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService, private loadingCtrl: LoadingController,private analytics : AnalyticsProvider, public storage: Storage) {
    this.role = navParams.get('role');

    this.Step1Form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')])
    });
    this.analytics.setScreenName("Register-step1");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("Register-step1", "View"));
  }

  equalTo(equalControlName): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control['_parent']) return null;
      if (!control['_parent'].controls[equalControlName])
      throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
      var controlMatch = control['_parent'].controls[equalControlName];
      return controlMatch.value == control.value ? null : {
        'equalTo': true
      };
    };
  }

  next(form1Value){
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      dismissOnPageChange: true
    });
    loading.present();

    // pick this up from otp flow now
    form1Value.phone = this.navParams.data.phone;
    let formParams = Object.assign({},...form1Value);
    delete formParams.confPassword;

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'isNewEmail',
        { email: form1Value.email }
      ).then(async API => {
        return await this.dataService.http.post(API.apiUrl, API.apiBody, API.apiHeaders).then(
          async isNewEmail => {
            loading.dismiss();
            console.log(isNewEmail);
            if (isNewEmail.data.result == true) {

              this.navCtrl.push("RegisterStep2Page", { form1Values : formParams, role: this.role });
              return await this.storage.get('Registration').then(async registration=>{
                if(registration){
                  registration.step = 1;
                  registration.form1Values = formParams;
                  this.storage.set('Registration', registration);
                  return await registration;
                }else{
                  return await this.storage.set('Registration', { step:1, form1Values : formParams, role: this.role }).then(async () => {
                    return await { step:1, form1Values : formParams, role: this.role };
                  });
                }
              })
            } else {
              this.notNewEmail = true;
              return false;
            }
          }, err => {
            console.log(err);
          }
        );
      });
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RegisterStep1Page');
  }

}
