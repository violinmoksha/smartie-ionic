import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { SmartieAPI } from '../../providers/api/smartie';
//import { Reviews } from '../reviews/reviews';

/**
 * Generated class for the SetReviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-set-review',
  templateUrl: 'set-review.html',
})
export class SetReview {

  private params: any;
  private ReviewForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.params = navParams.data;

    console.log(this.params);

    this.ReviewForm = this.formBuilder.group({
      review: ['', Validators.required],
      rating: ['']
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetReviewPage');
  }

  ReviewSubmit(ReviewData){
    // TODO: commented for a clean LINT, for now, pls proceed
    //let currUserRole = localStorage.getItem('loggedUserRole');
    //let currProfile = JSON.parse(localStorage.getItem(currUserRole + 'userProfile'));
  }

}
