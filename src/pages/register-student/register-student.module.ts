import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStudentPage } from './register-student';

@NgModule({
  declarations: [
    RegisterStudentPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterStudentPage),
  ],
  exports: [
    RegisterStudentPage
  ]
})
export class RegisterStudentPageModule {}
