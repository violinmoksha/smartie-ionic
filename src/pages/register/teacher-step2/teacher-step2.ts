import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RegisterTeacherStep3 } from './../teacher-step3/teacher-step3';

/**
 * Generated class for the TeacherStep2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-teacher-step2',
  templateUrl: 'teacher-step2.html',
})

export class RegisterTeacherStep2 {

  private Teacherstep2Form: FormGroup;
  private form1Values: any;

  public languages = [{
      langid: 1,
      name: "English",
      value: "englsh"
    }, {
      langid: 2,
      name: "Thai",
      value: "thai"
    }, {
      langid: 3,
      name: "Chinese",
      value: "chinese"
    }, {
      langid: 4,
      name: "Japanese",
      value: "japanese"
    },{
      langid: 5,
      name: "French",
      value: "french"
    }];

  public levels = [{
    "name": "K",
    "value": "k"
  }, {
    "name": "Primary",
    "value": "primary"
  }, {
    "name": "High School",
    "value": "highSchool"
  },{
    "name": "University",
    "value": "university"
  }];

  private formBuilder: FormBuilder;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.form1Values = navParams.data.form1Value;
    this.Teacherstep2Form = this.formBuilder.group({
        teacherLanguage: this.formBuilder.array([], Validators.required),
        teacherLevel: this.formBuilder.array([], Validators.required)
        // teacherLevel: ['true', Validators.required]
    });

  }

  onChangeTeacherLanguage(name: string, isChecked: boolean) {
    const knownLanguage = <FormArray>this.Teacherstep2Form.controls.teacherLanguage;

    if(isChecked) {
      knownLanguage.push(new FormControl(name));
    } else {
      let index = knownLanguage.controls.findIndex(x => x.value == name)
      knownLanguage.removeAt(index);
    }
  }

  onChangeLevelLanguage(name: string, isChecked: boolean) {
    const knownLevel = <FormArray>this.Teacherstep2Form.controls.teacherLevel;

    if(isChecked) {
      knownLevel.push(new FormControl(name));
    } else {
      let index = knownLevel.controls.findIndex(x => x.value == name)
      knownLevel.removeAt(index);
    }
  }

  next(form2Value){
    this.navCtrl.push(RegisterTeacherStep3, { form1Value: this.form1Values, form2Value : form2Value });
  }
  // updateTeacherLanguage(event){
  //   console.log(event);
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TeacherStep2Page');
  // }

}
