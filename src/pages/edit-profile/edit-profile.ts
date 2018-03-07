import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Parse } from 'parse';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the EditProfile page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userRole: string;
  email: string;
  username: string;

  private EditProfileForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController) {
    this.EditProfileForm = new FormGroup({
      password: new FormControl('', [Validators.required])
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
    Parse.User.logIn(this.username, form1Value.password).then(user => {
      this.navCtrl.push("EditProfileStep2Page", { form1Value : form1Value });
    }).catch(err => {
      let alert = this.alertCtrl.create({
        title: 'Login Failed !',
        subTitle: 'Invalid Password',
        buttons: ['OK']
      });
      alert.present();
      return false;
    });
  }

}
