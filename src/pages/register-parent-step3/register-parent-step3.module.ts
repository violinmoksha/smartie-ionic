import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterParentStep3Page } from './register-parent-step3';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterParentStep3Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterParentStep3Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterParentStep3Page
  ]
})
export class RegisterParentStep3PageModule {}
