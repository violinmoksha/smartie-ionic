import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPaymentPage } from './add-payment';

@NgModule({
  declarations: [
    AddPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPaymentPage),
  ],
})
export class AddPaymentPageModule {}
