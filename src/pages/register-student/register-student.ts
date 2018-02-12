import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

/**
 * Generated class for the RegisterStudentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'register-page-student',
  templateUrl: 'register-student.html',
})
export class RegisterStudentPage {

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
    this.navCtrl.push("RegisterStudentStep2Page", { form1Value : form1Value });
  }

}
