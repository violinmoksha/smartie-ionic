import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterTeacher } from './teacher/teacher';
import { RegisterStudent } from './student/student';
import { RegisterParent } from './parent/parent';
import { RegisterSchool } from './school/school';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  constructor(public navCtrl: NavController) {

  }

  pushPage(item){
    if(item == 'teacher')
      this.navCtrl.push(RegisterTeacher);
    if(item == 'student')
      this.navCtrl.push(RegisterStudent);
    if(item == 'parent')
      this.navCtrl.push(RegisterParent);
    if(item == 'school')
      this.navCtrl.push(RegisterSchool);
  }

}
