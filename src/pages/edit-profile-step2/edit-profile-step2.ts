import { IonicPage } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Slides, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { AnalyticsProvider } from '../../providers/analytics';
import { FileUploaderProvider } from './../../providers/file-uploader';
import { CameraServiceProvider } from './../../providers/camera-service';

declare let google;
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
  private schoolCameraData: string;
  private schoolPhotoSelected: boolean;
  private schoolPhotoTaken: boolean;
  private schoolCameraUrl:string;
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
  public loading = this.loadingCtrl.create({
    content: 'Loading...',
    dismissOnPageChange: true
  });
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public actionSheetCtrl: ActionSheetController, public storage: Storage,private analytics : AnalyticsProvider, public cameraService:CameraServiceProvider, public fileUploader:FileUploaderProvider, public loadingCtrl:LoadingController) {
    this.analytics.setScreenName("EditProfile_step2");
    this.analytics.addEvent(this.analytics.getAnalyticEvent("EditProfile_step2", "View"));
    this.userRole = navParams.get("userRole");

    if(this.userRole == 'school'){
      this.EditProfilestep2Form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')]),
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
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')]),
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
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.equalTo('password')]),
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
        this.schoolPicSrc = roleProfile.profileData.schoolPhoto;
      }
      if(roleProfile.profileData.profilePhoto){
        this.pageProfileSrc = roleProfile.profileData.profilePhoto;
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
        this.schoolName = roleProfile.profileData.schoolName;
        this.contactName = roleProfile.profileData.contactName;
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
  chooseUploadType(inputEvent, photoFor) {
    this.cameraService.getImage().then(imageData => {
      this.cameraData = imageData[0];
      this.storage.set('profilePhotoDataUrl', imageData[0]);
      this.photoTaken = true;
      this.photoSelected = false;
    })
  }

  public filterpartOfSchool(result: string): void {
    // Handle what to do when a category is selected
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

  submitStep2(form2Values) {

    this.loading.present();

    if(this.cameraData || this.schoolCameraData){
      var uploadContent = null;
      if(this.cameraData){
        uploadContent = this.cameraData;
      }else if(this.schoolCameraData){
        uploadContent = this.schoolCameraData;
      }
      this.fileUploader.uploadFileToAWS(uploadContent, this.fileUploader.awsBucket.profile).then(res => {
        form2Values.profilePhoto = res;
        this.next(form2Values);
      })
    }else{
      this.next(form2Values);
    }
  }

  next(form2Value){
    this.navCtrl.push("EditProfileStep3Page", { form1Value: this.form1Values, form2Value : form2Value, partOfSchool: this.partOfSchool, userRole: this.userRole });
  }

}
