import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SmartieAPI } from '../../providers/api/smartie';

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


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private smartieApi: SmartieAPI) {
    this.params = navParams.data;

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
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      this.profileId = UserProfile.profileData.objectId;
      this.profilePhoto = this.profilePhoto = UserProfile.profileData.profilePhoto.url;
    });
  }

  submit(legalEntityValues){
    this.body = {
      stripeAccountId: this.params.stripeAccount.id,
      profileId: this.profileId,
      legalEntityValues: legalEntityValues
    };

    let API = this.smartieApi.getApi(
      'verifyTeacherIdentity',
      this.body
    );
    interface Response {
      result: any;
    };
    this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders ).subscribe(response => {
      this.navCtrl.push("AddBankAccountPage", { stripeAccount: response.result });
    }, err => {
      console.log(err);
    })
  }

}
