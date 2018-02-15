import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherStep1Page } from './register-teacher-step1';

@NgModule({
  declarations: [
    RegisterTeacherStep1Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherStep1Page),
  ],
  exports: [
    RegisterTeacherStep1Page
  ]
})
export class RegisterTeacherStep1PageModule {}
