import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CardPage } from '../card/card';


/**
 * Generated class for the TeacherJobAcceptedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-teacher-job-accepted',
  templateUrl: 'teacher-job-accepted.html',
})
export class TeacherJobAccepted {

  profilePhoto:string = './assets/img/user-round-icon.png';
  profileLocationIcon:string = './assets/img/teacher-map-icon30px.png';
  profileData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // console.log(JSON.parse(localStorage.getItem('TeacherJobAcceptedResult')));
    this.profileData = navParams.data.data.prof;
  }


  payToTeacher(){
    this.navCtrl.push(CardPage, { customerId : this.profileData.objectId });
  }

}
