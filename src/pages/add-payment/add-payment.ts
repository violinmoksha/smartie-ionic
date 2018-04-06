import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SmartieAPI } from '../../providers/api/smartie';

/**
 * Generated class for the AddPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage {

  private userRole: any;
  private fullName: any;
  private email: any;
  private profilePhoto: any;
  private PaymentForm : FormGroup;
  private body: any;
  private profileId: any;
  private stripeAccountId: any;
  private userIP: string;
  private fromWhere: any;
  private smartieEndPoint: any;
  private targetNavpage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private smartieApi: SmartieAPI) {

    this.fromWhere = navParams.data.fromWhere;
    this.PaymentForm = new FormGroup({
      emailPayment: new FormControl('', Validators.required),
      emailConfirm: new FormControl('yes'),
    });
    this.smartieApi.http.get('https://icanhazip.com', { responseType: 'text' }).subscribe(res => {
      this.userIP = res.replace(/\s/g, "");
      console.log(`IP ADDRESS: ${this.userIP}`);
    })
  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.profileId = UserProfile.profileData.objectId;
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.email = UserProfile.userData.email;
      this.profilePhoto = UserProfile.profileData.profilePhoto.url;
      // this.stripeAccountId = UserProfile.profileData.stripeCustomer.id;
    })
  }

  updateStripeAccount(){
    //console.log(this.stripeAccountId);
    this.body = {
      // stripeAccountId: this.stripeAccountId,
      // profileId: this.profileId,
      // userIP: this.userIP // for TOS acceptance
    };
    let API = this.smartieApi.getApi(
      'deleteTeacherAccount',
      this.body
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
      this.navCtrl.push("PaymentthankyouPage", { fromWhere: 'teacherStripePayment'});
    }, err => {
      console.log(err);
    })
  }

  addStripeAccount(data){

    if(this.fromWhere !== 'teacher'){
      this.smartieEndPoint = 'createCustomer';
      this.targetNavpage = 'NotificationFeedPage';
    }else{
      this.smartieEndPoint = 'createTeacherAccount';
      this.targetNavpage = 'VerifyIdentityPage';
    }

    if(data.emailConfirm == 'yes'){
      data.emailPayment = this.email;
    }

    // NB: this page flow is only for Teachers
    // there is no Payment Details flow in non-Teachers!
    let API = this.smartieApi.getApi(
      this.smartieEndPoint,
      { emailPayment: data.emailPayment, userIP: this.userIP, profileId: this.profileId  }
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
      // TODO: we pass the stripeAccount to VerifyIdentityPage
      // so that we can find the required additional fields in
      // stripeAccount.verification.fields_needed
      this.navCtrl.push(this.targetNavpage, { stripeAccount: response.result });
    }, err => {
      console.log(err);
    })
  }
}
