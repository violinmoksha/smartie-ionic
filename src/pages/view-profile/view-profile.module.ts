import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProfile } from './view-profile';

@NgModule({
  declarations: [
    ViewProfile,
  ],
  imports: [
    IonicPageModule.forChild(ViewProfile),
  ],
  exports: [
    ViewProfile
  ]
})
export class ViewProfilePageModule {}
