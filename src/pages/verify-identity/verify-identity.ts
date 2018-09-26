import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../app/app.data';
import { AnalyticsProvider } from '../../providers/analytics';
/**
 * Generated class for the VerifyIdentityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-identity',
  templateUrl: 'verify-identity.html',
})
export class VerifyIdentityPage {

  private VerifyIdentityForm: FormGroup;
  private userRole: string;
  private fullName: any;
  private params: any;
  private body: any;
  private profilePhoto: any;
  private profileId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics : AnalyticsProvider,private storage: Storage, private dataService: DataService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.analytics.setScreenName("VerifyIdentity");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("VerifyIdentity", "View"));

    this.params = navParams.data;
    console.log(this.params.stripeAccount.stripeCustomer.id);

    this.VerifyIdentityForm = new FormGroup({
      legalAddressCity: new FormControl('', Validators.required),
      legalAddressLine1: new FormControl('', Validators.required),
      legalAddressPostalCode: new FormControl('', Validators.required),
      legalAddressState: new FormControl('', Validators.required),
      legalDobDate: new FormControl('', Validators.required),
      legalDobMonth: new FormControl('', Validators.required),
      legalDobYear: new FormControl('', Validators.required),
      legalFirstName: new FormControl('', Validators.required),
      legalLastName: new FormControl('', Validators.required),
      legalSsn: new FormControl(''),
      legalType: new FormControl('', Validators.required)
    })
  }


  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {

      console.log(UserProfile);

      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.profileId = UserProfile.profileData.objectId;
      this.profilePhoto = this.profilePhoto = UserProfile.profileData.profilePhoto.url;
    });
  }

  submit(legalEntityValues){
    let loading = this.loadingCtrl.create({
      content: 'Verifying identity...'
    });
    loading.present();

    this.body = {
      stripeAccountId: this.params.stripeAccount.stripeCustomer.id,
      profileId: this.profileId,
      legalEntityValues: legalEntityValues
    };

    return new Promise(async (resolve) => {
      return await this.dataService.getApi(
        'verifyTeacherIdentity',
        this.body
      ).then(async API => {
        return await this.dataService.httpPost(API['apiUrl'], API['apiBody'], API['apiHeaders']).then(response => {
          // TODO redo this as plain ol this.storage
          //return await this.dataService.updateUserProfileStorage(response[0].result).then(profile => {
            //loading.dismiss();
            this.navCtrl.push("AddBankAccountPage", { stripeAccount: response.result });
          //});
        }, err => {
          loading.dismiss();
          console.log(err.error.error.message);
          this.verifyIdentityError(err.error.error.message);
        })
      });
    });
  }

  verifyIdentityError(errorMessage){
    let alert;
    alert = this.alertCtrl.create({
      title: 'Identify Verification Failed !',
      subTitle: errorMessage,
      buttons: ['OK']
    });

    alert.present();
  }

}
