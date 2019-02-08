import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GooglePlacePickerPage } from './google-place-picker';

@NgModule({
  declarations: [
    GooglePlacePickerPage,
  ],
  imports: [
    IonicPageModule.forChild(GooglePlacePickerPage),
  ],
})
export class GooglePlacePickerPageModule {}
