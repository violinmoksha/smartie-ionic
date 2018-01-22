import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherStep2Page } from './register-teacher-step2';

@NgModule({
  declarations: [
    RegisterTeacherStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherStep2Page),
  ],
  exports: [
    RegisterTeacherStep2Page
  ]
})
export class RegisterTeacherStep2PageModule {}
