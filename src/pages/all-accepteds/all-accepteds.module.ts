import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllAcceptedsPage } from './all-accepteds';
 
@NgModule({
  declarations: [
    AllAcceptedsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllAcceptedsPage),
  ],
  exports: [
    AllAcceptedsPage
  ]
})
export class AllAcceptedsPageModule {}
