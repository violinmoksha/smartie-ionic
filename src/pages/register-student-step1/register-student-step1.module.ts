import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStudentStep1Page } from './register-student-step1';

@NgModule({
  declarations: [
    RegisterStudentStep1Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterStudentStep1Page),
  ],
  exports: [
    RegisterStudentStep1Page
  ]
})
export class RegisterStudentStep1PageModule {}
