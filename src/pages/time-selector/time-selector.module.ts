import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeSelectorPage } from './time-selector';

@NgModule({
  declarations: [
    TimeSelectorPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeSelectorPage),
  ],
})
export class TimeSelectorPageModule {}
