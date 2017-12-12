import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterTeacher } from './teacher/teacher';
import { RegisterStudent } from './student/student';
import { RegisterParent } from './parent/parent';
import { RegisterSchool } from './school/school';
import { Pro } from '@ionic/pro';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  constructor(public navCtrl: NavController) {
    Pro.getApp().monitoring.log('Register.construct', { level: 'error' });
  }

  pushPage(item){
    if(item == 'teacher')
      Pro.getApp().monitoring.log('Trying to push RegisterTeacher.', { level: 'error' });
      this.navCtrl.push(RegisterTeacher);
    if(item == 'student')
      this.navCtrl.push(RegisterStudent);
    if(item == 'parent')
      this.navCtrl.push(RegisterParent);
    if(item == 'school')
      this.navCtrl.push(RegisterSchool);
  }

}
