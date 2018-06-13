import { IonicPage } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Slides } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the EditProfileStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-edit-profile-step2',
  templateUrl: 'edit-profile-step2.html',
})
export class EditProfileStep2Page {

  private userRole: string;
  private EditProfilestep2Form: FormGroup;
  private form1Values: any;
  pageProfileSrc: string;
  schoolPicSrc:string;
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  partOfSchool: string;
  @ViewChild(Slides) roleSchool: Slides;

  userName: string;
  email: string;
  fullName: string;
  schoolName: string;
  othersSchoolName: string;
  contactName: string;
  contactPosition: string;
  phone: string;
  profileTitle: string;
  profileAbout: string;
  sessionToken: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController, public storage: Storage) {

    this.userRole = navParams.get("userRole");
    this.sessionToken = navParams.get("sessionToken");

    if(this.userRole == 'school'){
      this.EditProfilestep2Form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl(''),
        email: new FormControl('', Validators.required),
        schoolName: new FormControl('', Validators.required),
        contactName: new FormControl('', Validators.required),
        contactPosition: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required)
      });
    } else if (this.userRole == 'teacher'){
      this.EditProfilestep2Form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl(''),
        email: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        // othersSchoolName: new FormControl('')
      });
    } else{
      this.EditProfilestep2Form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl(''),
        email: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        profileTitle: new FormControl('', Validators.required),
        profileAbout: new FormControl('', Validators.required),
        othersSchoolName: new FormControl('')
      });
    }

    this.storage.get("UserProfile").then(roleProfile => {
      if(roleProfile.profileData.schoolPhoto){
        this.schoolPicSrc = roleProfile.profileData.schoolPhoto.url;
      }
      if(roleProfile.profileData.profilePhoto){
        this.pageProfileSrc = roleProfile.profileData.profilePhoto.url;
      }else{
        if (this.userRole == 'teacher') {
          this.pageProfileSrc = './assets/img/user-img-teacher.png';
        } else if (this.userRole == 'student') {
          this.pageProfileSrc = './assets/img/user-img-student.png';
        } else if (this.userRole == 'parent') {
          this.pageProfileSrc = './assets/img/user-img-parent.png';
        } else if (this.userRole == 'school') {
          this.pageProfileSrc = './assets/img/user-img-school.png';
          this.schoolPicSrc = './assets/img/school-img.png';
        }
      }

      this.userName = roleProfile.userData.username;
      this.email = roleProfile.userData.email;
      this.fullName = roleProfile.profileData.fullname;
      this.phone = roleProfile.profileData.phone;
      this.profileTitle = roleProfile.profileData.profileTitle;
      this.profileAbout = roleProfile.profileData.profileAbout;

      if (this.userRole == 'school') {
        this.schoolName = roleProfile.specificUser.schoolName;
        this.contactName = roleProfile.specificUser.contactName;
        this.contactPosition = roleProfile.specificUser.contactPosition;
      } else if (this.userRole == 'teacher') {
      } else {
        this.partOfSchool = roleProfile.specificUser.partOfSchool;
        this.fullName = roleProfile.profileData.fullname;
        this.othersSchoolName = roleProfile.profileData.schoolName;
      }

      // and get the pageProfileSrc from localStorage???
      //this.pageProfileSrc = JSON.parse(localStorage.getItem(`${role}UserProfile`)).profileData.profilePhoto.url;
    });

    this.form1Values = navParams.data.form1Value;
  }

  chooseUploadType(inputEvent){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How you like to upload your photos',
      buttons: [
        {
          text: 'Take Picture',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            var options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL
            };
            this.camera.getPicture(options).then((imageData) => {
              this.cameraData = 'data:image/jpeg;base64,' + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraData);
              this.photoTaken = true;
              this.photoSelected = false;
            }, (err) => {
            // Handle error
              console.log(err);
            });
          }
        },{
          text: 'Open Gallery',
          role: 'openGallery',
          icon: 'image',
          handler: () => {
            console.log('Gallery clicked');
            let options = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              quality : 100
            };

            this.camera.getPicture(options).then((imageData) => {
             // imageData is either a base64 encoded string or a file URI
             // If it's base64:
              this.cameraUrl = "data:image/jpeg;base64," + imageData;
              localStorage.setItem('profilePhotoDataUrl', this.cameraUrl);
              // console.log(this.cameraUrl);
              this.photoSelected = true;
              this.photoTaken = false;
            }, (err) => {
             // Handle error
             console.log(err);
            });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public filterpartOfSchool(result: string): void {
    // Handle what to do when a category is selected
    console.log(result);
    if(result == 'yes'){
      this.EditProfilestep2Form.get('othersSchoolName').setValidators([Validators.required]);
    }else{
      this.EditProfilestep2Form.get('othersSchoolName').setValidators([]);
    }
    this.partOfSchool = result;
  }

  getRole() {
    return this.userRole;
  }

  next(form2Value){
    this.navCtrl.push("EditProfileStep3Page", { form1Value: this.form1Values, form2Value : form2Value, partOfSchool: this.partOfSchool, userRole: this.userRole, sessionToken: this.sessionToken });
  }

}
