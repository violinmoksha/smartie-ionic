import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherStep2Page } from './register-teacher-step2';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterTeacherStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherStep2Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterTeacherStep2Page
  ]
})
export class RegisterTeacherStep2PageModule {}
