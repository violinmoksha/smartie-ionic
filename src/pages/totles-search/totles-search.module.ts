import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TotlesSearch } from './totles-search';

@NgModule({
  declarations: [
    TotlesSearch,
  ],
  imports: [
    IonicPageModule.forChild(TotlesSearch),
  ],
  exports: [
    TotlesSearch
  ]
})
export class TotlesSearchPageModule {}
