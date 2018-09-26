import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the SendEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-email',
  templateUrl: 'send-email.html',
})
export class SendEmailPage {

  params: any;
  role: any;
  recipientProfileId: any;
  recipientName: any;
  message: any = '';
  subject: any = '';
  messageIsValid: boolean = false;
  private senderName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,public storage: Storage, public dataService: DataService) {
    this.analytics.setScreenName("SendEmail");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("SendEmail", "View"));

    this.params = navParams.data.params;

    this.storage.get('UserProfile').then(UserProfile => {
      this.role = UserProfile.profileData.role;
      this.recipientName = this.params.fullname;
      this.senderName = UserProfile.profileData.fullname;


      if(this.role != 'teacher'){
        this.recipientProfileId = this.params.teacherProfileId;
      }else{
        this.recipientProfileId = this.params.otherProfileId;
      }
    });
  }

  test(){
    if(this.message == ""){
      this.messageIsValid = false;
    }else{
      this.messageIsValid = true;
    }
  }

  sendEmail(){

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'sendEmail',
        { recipientProfileId: this.recipientProfileId, senderRole: this.role, senderName: this.senderName, recipientName: this.recipientName, subject: this.subject, message: this.message }
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders'] ).then(response => {
          this.navCtrl.parent.select(0);
        }, err => {
          console.log(err);
        })
      });
    });
  }

}
