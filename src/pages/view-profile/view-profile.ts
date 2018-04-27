import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  role: any;
  params: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.params = navParams.data.params;

    this.storage.get("UserProfile").then(profile => {
      this.role = profile.profileData.role;
    })
  }

  /* ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
  } */

  viewReviews(){
    this.navCtrl.push("ReviewsPage", { params: this.params });
  }

}
