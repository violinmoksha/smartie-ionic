import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterParentStep2Page } from './register-parent-step2';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterParentStep2Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterParentStep2Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterParentStep2Page
  ]
})
export class RegisterParentStep2PageModule {}
