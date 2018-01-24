import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeacherStep3Page } from './register-teacher-step3';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterTeacherStep3Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeacherStep3Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterTeacherStep3Page
  ]
})
export class RegisterTeacherStep3PageModule {}
