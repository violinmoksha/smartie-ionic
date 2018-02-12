import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Pro } from '@ionic/pro';

@IonicPage()@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  constructor(public navCtrl: NavController) {
    //Pro.getApp().monitoring.log('Register.construct', { level: 'error' });
  }

  pushPage(item){
    if(item == 'teacher')
      //Pro.getApp().monitoring.log('Trying to push RegisterTeacher.', { level: 'error' });
      this.navCtrl.push("RegisterTeacherPage");
    if(item == 'student')
      this.navCtrl.push("RegisterStudentPage");
    if(item == 'parent')
      this.navCtrl.push("RegisterParentPage");
    if(item == 'school')
      this.navCtrl.push("RegisterSchoolPage");
  }

}
