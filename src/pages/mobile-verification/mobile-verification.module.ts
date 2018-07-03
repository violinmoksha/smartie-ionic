import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileVerificationPage } from './mobile-verification';

@NgModule({
  declarations: [
    MobileVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(MobileVerificationPage),
  ],
})
export class MobileVerificationPageModule {}
