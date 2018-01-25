import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStudentStep2Page } from './register-student-step2';

@NgModule({
  declarations: [
    RegisterStudentStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterStudentStep2Page),
  ],
  exports: [
    RegisterStudentStep2Page
  ]
})
export class RegisterStudentStep2PageModule {}
