import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherPage } from './register-teacher';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterTeacherPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherPage),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterTeacherPage
  ]
})
export class RegisterTeacherPageModule {}
