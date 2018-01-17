import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { EditProfileStep2 } from './edit-profile-step2/edit-profile-step2';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {

  pageProfileDefaultSrc:string = './assets/img/dummy_prof_pic.png';
  pageSchoolDefaultSrc:string = './assets/img/school-img.png';
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  email: string;
  username: string;

  private EditProfileForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.EditProfileForm = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl('', [Validators.minLength(6)])
    });

    this.email = JSON.parse(localStorage.getItem('teacherUserProfile')).userData.email;
    this.username = JSON.parse(localStorage.getItem('teacherUserProfile')).userData.username;
  }

  getRole() {
    return this.storage.get("role");
  }

  next(form1Value){
    this.navCtrl.push(EditProfileStep2, { form1Value : form1Value });
  }

}
