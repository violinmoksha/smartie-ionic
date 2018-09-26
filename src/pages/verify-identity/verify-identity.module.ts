import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyIdentityPage } from './verify-identity';

@NgModule({
  declarations: [
    VerifyIdentityPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyIdentityPage),
  ],
})
export class VerifyIdentityPageModule {}
