import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewAppointmentPage } from './view-appointment';

@NgModule({
  declarations: [
    ViewAppointmentPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewAppointmentPage),
  ],
})
export class ViewAppointmentPageModule {}
