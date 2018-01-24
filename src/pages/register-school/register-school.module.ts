import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSchoolPage } from './register-school';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterSchoolPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterSchoolPage),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterSchoolPage
  ]
})
export class RegisterSchoolPageModule {}
