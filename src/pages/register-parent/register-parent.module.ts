import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterParentPage } from './register-parent';

@NgModule({
  declarations: [
    RegisterParentPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterParentPage),
  ],
  exports: [
    RegisterParentPage
  ]
})
export class RegisterParentPageModule {}
