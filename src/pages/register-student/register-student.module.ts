import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStudentPage } from './register-student';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterStudentPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterStudentPage),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterStudentPage
  ]
})
export class RegisterStudentPageModule {}
