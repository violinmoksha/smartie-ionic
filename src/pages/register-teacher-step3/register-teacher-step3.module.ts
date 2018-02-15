import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherStep3Page } from './register-teacher-step3';

@NgModule({
  declarations: [
    RegisterTeacherStep3Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherStep3Page),
  ],
  exports: [
    RegisterTeacherStep3Page
  ]
})
export class RegisterTeacherStep3PageModule {}