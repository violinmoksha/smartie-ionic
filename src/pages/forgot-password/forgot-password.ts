import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  private ForgotForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private smartieApi: SmartieAPI) {

    this.ForgotForm = new FormGroup({
      email: new FormControl('')
    });
  }

  forgotPassword(email){
    if (email == '') {
      let alert = this.alertCtrl.create({
        title: 'Email Link failed!',
        subTitle: 'Please specify your Email!',
        buttons: ['OK']
      });
      alert.present();
    } else if (email !== '') {
      let API = this.smartieApi.getApi(
        'forgotPassword',
        {email: email}
      );

      return new Promise(resolve => {
        interface Response {
          sent: boolean
        };
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
          if (res.sent == true) {
            this.navCtrl.push("LoginPage");
          } else {
            let alert = this.alertCtrl.create({
              title: 'Email Link failed!',
              subTitle: 'User unknown!',
              buttons: ['OK']
            });
            alert.present();
          }
        });
      });
    }
  }

}
