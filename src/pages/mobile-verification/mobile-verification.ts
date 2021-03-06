import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,LoadingController } from 'ionic-angular';
import { DataService } from '../../app/app.data';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AnalyticsProvider } from '../../providers/analytics';
import { FetchiOSUDID } from '../../providers/fetch-ios-udid';

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
  notNewPhone: boolean;

  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public device: Device, public dataService: DataService, public loadingCtrl: LoadingController, public storage: Storage,public formBuilder: FormBuilder,public analytics : AnalyticsProvider, public fetchiOSUDID: FetchiOSUDID) {
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
    this.analytics.setScreenName("MobileVerification");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "View"));
  }

  pushSignUp(){
    this.analytics.addEvent(this.analytics.getAnalyticEvent("MobileVerification", "Clicked_MobileVerifyButton"));

    // Remove "Registration" and "UserProfile" keys from storage
    this.storage.remove("Registration");
    this.storage.remove("UserProfile");

    if (this.platform.is('ios')) {
      this.fetchiOSUDID.fetch().then(iOSUDID => {
        this.pushSignUpInner(iOSUDID);
      });
    } else {
      // android, persistant UDID
      console.log('Going into pushSignUpInner in droid');
      this.pushSignUpInner(this.device.uuid);
    }
  }

  pushSignUpInner(UDID) {
    // encrypt UUID
    //return this.dataService.getBeyondGDPR(true, {"plaintext":UDID}).then(cryptUUID => {
      //console.log(`Got cryptUUID of ${cryptUUID.plaintext}`);
      let deviceUUID: any;
      //if (cryptUUID) {
        //deviceUUID = cryptUUID.plaintext;
      //} else { // chickenSwitch == false
        deviceUUID = UDID;
      //}

      // TODO: actually wire this to beyondgdpr, for now we're going with plaintext this.device.uuid
      let provParams={
        "uuid": (this.platform.is('cordova')) ? deviceUUID :'123456',
        "device": { 'cordova': this.device.cordova, 'isVirtual': this.device.isVirtual, 'manufacturer': this.device.manufacturer, 'model': this.device.model, 'platform': this.device.platform, 'serial': this.device.serial, 'uuid': UDID, 'version': this.device.version },
        "role": this.role,
        "phone": this.phoneNumber
      }

      let phoneParams = {
        "phone": this.phoneNumber
      }

      let loading = this.loadingCtrl.create({
        content: 'Provisioning....'
      });

      return new Promise(async (resolve) => {
        loading.present();
        return await this.dataService.getApi(
          'isNewPhone',
          phoneParams
        ).then(async API => {
          this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response => {
            //loading.dismiss();
            if (response.result == false) {
              this.notNewPhone = true;
              return await false;
            } else {
              this.dataService.minionToken = response.result.mToken;

              return await this.dataService.getApi(
                'setUserProvision',
                provParams
              ).then(async API => {
                this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(async response=>{
                  loading.dismiss();
                  this.storage.set("Provision", response.result);
                  this.dataService.minionToken = undefined; // dealloc the transient minionToken, just in case
                  this.navCtrl.push("RegisterStep1Page", { role: this.role, phone: this.phoneNumber });
                },e=>{
                  loading.dismiss();
                  console.log(e);
                })
              });
            }
          }, e => {
            loading.dismiss();
            console.log(e);
          })
        });
      });
    //});
  }

  usedPhoneNumber() {

  }

  maskUSPhone(txt) {
    let x = txt.replace(/[^0-9]/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    txt = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    return txt;
  }

}
