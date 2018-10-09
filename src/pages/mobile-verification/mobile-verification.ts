import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,LoadingController } from 'ionic-angular';
import { DataService } from '../../app/app.data';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics';
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
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private device: Device, private dataService: DataService, private loadingCtrl: LoadingController, private storage: Storage,private formBuilder: FormBuilder,private analytics : AnalyticsProvider) {
    this.role = this.navParams.get('role');

    this.mobileVerification = this.formBuilder.group({
     mobileNumber:['', Validators.compose([
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(14)
    ])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');

    this.analytics.setScreenName("MobileVerification");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "View"));
  }

  pushSignUp(){
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "Clicked_MobileVerifyButton"));

    // encrypt UUID
    this.dataService.getBeyondGDPR(true, {"plaintext":this.device.uuid}).then(cryptUUID => {
      let deviceUUID;
      if (cryptUUID) {
        deviceUUID = cryptUUID;
      } else { // chickenSwitch == false
        deviceUUID = this.device.uuid;
      }

      // TODO: actually wire this to beyondgdpr, for now we're going with plaintext this.device.uuid
      let params={
        //"uuid": (this.platform.is('cordova')) ? deviceUUID :'123456',
        "uuid": (this.platform.is('cordova')) ? this.device.uuid :'123456',
        "device": { 'cordova': this.device.cordova, 'isVirtual': this.device.isVirtual, 'manufacturer': this.device.manufacturer, 'model': this.device.model, 'platform': this.device.platform, 'serial': this.device.serial, 'uuid': this.device.uuid, 'version': this.device.version },
        "role": this.role
      }

      let loading = this.loadingCtrl.create({
        content: 'Provisioning....'
      });

      return new Promise(async (resolve) => {
        loading.present();
        return await this.dataService.getApi(
          'setUserProvision',
          params
        ).then(async API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response=>{
            loading.dismiss();
            console.log("User provision: "+JSON.stringify(response))
            this.storage.set("Provision", response.result);
            this.navCtrl.push("RegisterStep1Page", { role: this.role, phone: this.phoneNumber });
          },e=>{
            loading.dismiss();
            console.log(e);
          })
        });
      });
    });
  }

  maskUSPhone(txt) {
    let x = txt.replace(/[^0-9]/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    txt = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    return txt;
  }

}
