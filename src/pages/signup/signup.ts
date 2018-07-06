import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  // @ViewChild('locationSearch') locationSearchElement: ElementRef;
  role: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = navParams.get('role');
    console.log(this.role);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    let input = document.getElementById("locationSearch").getElementsByTagName('input')[0];
    let options = {componentRestrictions: {country: 'us'}};

    let autocomplete = new google.maps.places.Autocomplete(input, options);
    
    console.log(autocomplete);

  }

}
