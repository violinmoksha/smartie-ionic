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

@Component({
  selector: 'page-edit-profile-step2',
  templateUrl: 'edit-profile-step2.html',
})
export class EditProfileStep2 {

  private EditProfilestep2Form: FormGroup;
  private form1Values: any;
  pageProfileSrc: string;
  pageSchoolSrc:string = './assets/img/school-img.png';
  cameraData: string;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  partOfSchool: string;
  @ViewChild(Slides) roleSchool: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController, public storage: Storage) {
    this.storage.get("role").then(role => {
      if (role == 'teacher') {
        this.pageProfileSrc = './assets/img/user-img-teacher.png';
      } else if (role == 'student') {
        this.pageProfileSrc = './assets/img/user-img-student.png';
      } else if (role == 'parent') {
        this.pageProfileSrc = './assets/img/user-img-parent.png';
      } else if (role == 'school') {
        this.pageProfileSrc = './assets/img/user-img-school.png';
      }
    });

    this.form1Values = navParams.data.form1Value;

    this.EditProfilestep2Form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      profileMessage: new FormControl('', Validators.required),
      roleSchoolName: new FormControl('')
    })
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
      this.EditProfilestep2Form.get('studentSchoolName').setValidators([Validators.required]);
    }else{
      this.EditProfilestep2Form.get('studentSchoolName').setValidators([]);
    }
    this.partOfSchool = result;
  }

  getRole() {
    return this.storage.get('role');
  }

  next(form2Value){
    //this.navCtrl.push(EditProfileStep3, { form1Value: this.form1Values, form2Value : form2Value, partOfSchool: this.partOfSchool });
  }

}
