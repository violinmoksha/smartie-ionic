import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { SmartieAPI } from '../../../providers/api/smartie';
import { Parse } from 'parse';
import { TotlesSearch } from '../../totles-search/totles-search';
import { RegisterParentStep2 } from './parent-step2/parent-step2';

/**
 * Generated class for the ParentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html',
})
export class RegisterParent {

  pageProfileSrc:string = './assets/img/dummy_prof_pic.png';
  private ParentStep1Form : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController, private smartieApi: SmartieAPI, private alertCtrl: AlertController) {

    this.ParentStep1Form = new FormGroup({
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
    this.navCtrl.push(RegisterParentStep2, { form1Value : form1Value });
  }
}
