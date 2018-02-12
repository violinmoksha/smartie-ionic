import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolStep2Page } from './register-school-step2';

@NgModule({
  declarations: [
    RegisterSchoolStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolStep2Page),
  ],
  exports: [
    RegisterSchoolStep2Page
  ]
})
export class RegisterSchoolStep2PageModule {}
