import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBankAccountPage } from './add-bank-account';

@NgModule({
  declarations: [
    AddBankAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBankAccountPage),
  ],
})
export class AddBankAccountPageModule {}
