import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolStep1Page } from './register-school-step1';

@NgModule({
  declarations: [
    RegisterSchoolStep1Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolStep1Page),
  ],
  exports: [
    RegisterSchoolStep1Page
  ]
})
export class RegisterSchoolStep1PageModule {}
