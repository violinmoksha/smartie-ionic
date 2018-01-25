import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolPage } from './register-school';

@NgModule({
  declarations: [
    RegisterSchoolPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolPage),
  ],
  exports: [
    RegisterSchoolPage
  ]
})
export class RegisterSchoolPageModule {}
