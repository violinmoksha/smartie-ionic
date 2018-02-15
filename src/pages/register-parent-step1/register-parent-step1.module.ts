import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterParentStep1Page } from './register-parent-step1';

@NgModule({
  declarations: [
    RegisterParentStep1Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterParentStep1Page),
  ],
  exports: [
    RegisterParentStep1Page
  ]
})
export class RegisterParentStep1PageModule {}
