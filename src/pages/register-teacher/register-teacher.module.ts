import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherPage } from './register-teacher';

@NgModule({
  declarations: [
    RegisterTeacherPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherPage),
  ],
  exports: [
    RegisterTeacherPage
  ]
})
export class RegisterTeacherPageModule {}
