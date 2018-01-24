import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterParentPage } from './register-parent';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterParentPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterParentPage),
    TranslateModule.forChild()
  ],
  exports: [
    RegisterParentPage
  ]
})
export class RegisterParentPageModule {}
