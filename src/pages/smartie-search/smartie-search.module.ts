import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmartieSearch } from './smartie-search';

@NgModule({
  declarations: [
    SmartieSearch,
  ],
  imports: [
    IonicPageModule.forChild(SmartieSearch),
  ],
  exports: [
    SmartieSearch
  ]
})
export class TotlesSearchPageModule {}
