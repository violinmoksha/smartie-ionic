import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AbstractControl, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { RegisterTeacherStep2 } from './../teacher-step2/teacher-step2';

@Component({
  selector: 'teacher-register',
  templateUrl: 'teacher.html'
})

export class RegisterTeacher {
  @ViewChild('input#first') firstInput ;

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private Teacherstep1Form: FormGroup;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;

  constructor(public navCtrl: NavController, private camera: Camera, public actionSheetCtrl: ActionSheetController) {

    this.Teacherstep1Form = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')])
    });

    this.firstInput.setFocus();
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
    this.navCtrl.push(RegisterTeacherStep2, { form1Value : form1Value });
  }

  //Form submit to get values
  Teacherstep1FormSubmit(){
    console.log(this.Teacherstep1Form.value)
  }

}
