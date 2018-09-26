import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentConfirmPage } from './payment-confirm';

@NgModule({
  declarations: [
    PaymentConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentConfirmPage),
  ],
})
export class PaymentConfirmPageModule {}
