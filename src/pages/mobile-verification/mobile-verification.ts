import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,LoadingController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { Response } from '../../providers/data-model/data-model';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
/**
 * Generated class for the MobileVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-verification',
  templateUrl: 'mobile-verification.html',
})
export class MobileVerificationPage {

  role: string;
  phoneNumber = '';
  mobileVerification: FormGroup;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private device: Device, private smartieApi: SmartieAPI, private loadingCtrl: LoadingController, private storage: Storage,private formBuilder: FormBuilder,private analytics : AnalyticsProvider) {
    this.role = navParams.get('role');

    console.log(this.device);

    this.mobileVerification = this.formBuilder.group({
     mobileNumber:['', Validators.compose([
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(14)
    ])]
    });
    this.analytics.setScreenName("MobileVerification");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "View"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');
  }

  pushSignUp(){
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "Clicked_MobileVerifyButton"));

    // encrypt UUID
    this.smartieApi.getBeyondGDPR(true, {"plaintext":this.device.uuid}).then(cryptUUID => {
      let deviceUUID;
      if (cryptUUID) {
        deviceUUID = cryptUUID;
      } else { // chickenSwitch == false
        deviceUUID = this.device.uuid;
      }

      let params={
        "uuid": (this.platform.is('cordova')) ? deviceUUID :'123456',
        "device": { 'cordova': this.device.cordova, 'isVirtual': this.device.isVirtual, 'manufacturer': this.device.manufacturer, 'model': this.device.model, 'platform': this.device.platform, 'serial': this.device.serial, 'uuid': deviceUUID, 'version': this.device.version },
        "role": this.role
      }

      let loading = this.loadingCtrl.create({
        content: 'Provisioning....'
      });

      return new Promise(async (resolve) => {
        let API = await this.smartieApi.getApi(
          'setUserProvision',
          params
        );
        loading.present();

        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(data=>{
          loading.dismiss();
          this.storage.set("Provision", data.result);
          this.navCtrl.push("RegisterStep1Page", { role: this.role, phone: this.phoneNumber });
        },e=>{
          loading.dismiss();
          console.log(e);
          console.log("coming here provision error");
        })
      });
    });
  }

  maskUSPhone(txt) {
    let x = txt.replace(/[^0-9]/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    txt = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    return txt;
  }

}
