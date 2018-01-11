import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';
import { Login } from '../../pages/login/login';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class Feedback {

  private sendInProgress: boolean;
  private loading: any;
  private FeedbackForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private smartieApi: SmartieAPI, private viewCtrl: ViewController, private loadingCtrl: LoadingController) {
    this.sendInProgress = false;
    this.loading = this.loadingCtrl.create({
      content: 'Sending Feedback...'
    });

    this.FeedbackForm = new FormGroup({
      email: new FormControl(''),
      feedback: new FormControl('')
    });
  }

  sendFeedback(value){
    this.loading.present();
    console.log(JSON.stringify(value));

    // p0 man validation heh but this is reeaaally simple form
    if (value.email == '') {
      let alert = this.alertCtrl.create({
        title: 'Please specify your email!',
        subTitle: 'Else we cannot reply to you!',
        buttons: ['OK']
      });
      alert.present();
    } else if (value.feedback == '') {
      let alert = this.alertCtrl.create({
        title: 'Oops, you left Feedback blank!',
        subTitle: 'Please leave some feedback!',
        buttons: ['OK']
      });
      alert.present();
    } else  {
      let API = this.smartieApi.getApi(
        'sendFeedback',
        {email: value.email, feedback: value.feedback}
      );

      return new Promise(resolve => {
        interface Response {
          sent: boolean,
          error: string
        };
        this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(res => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Feedback sent!',
            subTitle: 'Tap Back to return to what you were doing.',
            buttons: ['OK']
          });
          alert.present();
        }, err => {
          console.log(JSON.stringify(err));
          this.loading.dismiss();
          if (err.error.error.indexOf('valid') !== -1) {
            let alert = this.alertCtrl.create({
              title: 'Send feedback failed!',
              subTitle: 'Not a valid email address!',
              buttons: ['OK']
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title: 'Send feedback failed!',
              subTitle: 'Unknown error.',
              buttons: ['OK']
            });
            alert.present();
          }
        });
      });
    }
  }

  /*
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
            this.navCtrl.push(Login);
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
  */

}
