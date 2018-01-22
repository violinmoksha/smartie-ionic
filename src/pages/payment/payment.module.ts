import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentPage } from './payment';
import { PaymentConfirm } from './payment-confirm/payment-confirm';
import { PaymentThankyou } from './payment-thankyou/payment-thankyou';

@NgModule({
  declarations: [
    PaymentPage,
    PaymentConfirm,
    PaymentThankyou
  ],
  imports: [
    IonicPageModule.forChild(PaymentPage),
  ],
  exports: [
    PaymentPage,
    PaymentConfirm,
    PaymentThankyou
  ]
})
export class PaymentPageModule {}
