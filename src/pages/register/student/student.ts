import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { RegisterStudentStep2 } from './student-step2/student-step2';

/**
 * Generated class for the StudentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-student',
  templateUrl: 'student.html',
})
export class RegisterStudent {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private StudentStep1Form : FormGroup;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.StudentStep1Form = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6),  this.equalTo('password')])
    });
  }

  equalTo(equalControlName): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control['_parent']) return null;
      if (!control['_parent'].controls[equalControlName])
      throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
      var controlMatch = control['_parent'].controls[equalControlName];
      return controlMatch.value == control.value ? null : {
        'equalTo': true
      };
    };
  }

  next(form1Value){
    this.navCtrl.push(RegisterStudentStep2, { form1Value : form1Value });
  }

}
