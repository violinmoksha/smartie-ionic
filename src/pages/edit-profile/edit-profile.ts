import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { EditProfileStep2 } from './edit-profile-step2/edit-profile-step2';

/**
 * Generated class for the EditProfile page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {

  userRole: string;
  email: string;
  username: string;

  private EditProfileForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.EditProfileForm = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.storage.get("role").then(role => {
      this.userRole = role;
      this.email = JSON.parse(localStorage.getItem(`${role}UserProfile`)).userData.email;
      this.username = JSON.parse(localStorage.getItem(`${role}UserProfile`)).userData.username;
    })
  }

  getRole() {
    return this.userRole;
  }

  next(form1Value){
    this.navCtrl.push(EditProfileStep2, { form1Value : form1Value });
  }

}
