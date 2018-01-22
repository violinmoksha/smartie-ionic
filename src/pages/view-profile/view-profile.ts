import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfile {

  private params: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
  }

  viewReviews(profileId){
    this.navCtrl.push(Reviews, this.params);
  }

}
