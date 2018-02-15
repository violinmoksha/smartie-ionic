import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';

@IonicPage()@Component({
  selector: 'page-register-teacher-step1',
  templateUrl: 'register-teacher-step1.html'
})

export class RegisterTeacherStep1Page {
  private Teacherstep1Form: FormGroup;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {

    this.Teacherstep1Form = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')])
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
    this.navCtrl.push("RegisterTeacherStep2Page", { form1Value : form1Value });
  }

  //Form submit to get values
  Teacherstep1FormSubmit(){
    console.log(this.Teacherstep1Form.value)
  }

}
