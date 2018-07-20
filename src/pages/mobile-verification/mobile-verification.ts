import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { SmartieAPI } from '../../providers/api/smartie';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { Response } from '../../providers/data-model/data-model';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private device: Device, private smartieApi: SmartieAPI, private loadingCtrl: LoadingController, private storage: Storage) {
    this.role = navParams.get('role');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');
  }

  pushSignUp(){
    let params={
      "uuid": this.device.uuid,
      "device": this.device,
      "role": this.role,
    }

    console.log(params);
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
      })
    })
  }

  maskUSPhone(txt) {
    let x = txt.replace(/[^0-9]/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    txt = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    return txt;
  }
}
