import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolStep2Page } from './register-school-step2';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterSchoolStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolStep2Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterSchoolStep2Page
  ]
})
export class RegisterSchoolStep2PageModule {}
