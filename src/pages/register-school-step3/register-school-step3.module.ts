import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolStep3Page } from './register-school-step3';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterSchoolStep3Page
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolStep3Page),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterSchoolStep3Page
  ]
})
export class RegisterSchoolStep2PageModule {}
