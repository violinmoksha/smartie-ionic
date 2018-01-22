import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the FeedbackPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  private loading: any;
  private FeedbackForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private smartieApi: SmartieAPI, private loadingCtrl: LoadingController) {
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

    // p0 man validation heh but this is reeaaally simple form
    if (value.email == '' || value.feedback == '') {
      this.loading.dismiss();
    }

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

}
