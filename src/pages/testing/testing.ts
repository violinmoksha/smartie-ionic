import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TestingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html',
})
export class TestingPage {

  profileData: any;
  role: any;
  rating: any = '5';
  review: any = 'test12345';
  // private reviewedProfileId: any;
  private reviewingProfileId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    /* this.profileData = navParams.data.profileData;
    this.reviewedProfileId = this.profileData.objectId; */

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
      this.reviewingProfileId = profile.profileData.objectId;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestingPage');
  }

}
