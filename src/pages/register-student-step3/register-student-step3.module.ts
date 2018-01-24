import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStudentStep3Page } from './register-student-step3';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterStudentStep3Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterStudentStep3Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterStudentStep3Page
  ]
})
export class RegisterStudentStep3PageModule {}
