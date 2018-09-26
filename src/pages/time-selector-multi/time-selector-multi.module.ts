import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeSelectorMultiPage } from './time-selector-multi';

@NgModule({
  declarations: [
    TimeSelectorMultiPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeSelectorMultiPage),
  ],
})
export class TimeSelectorMultiPageModule {}
