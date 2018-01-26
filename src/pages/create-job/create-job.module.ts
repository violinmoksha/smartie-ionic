import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateJobPage } from './create-job';

@NgModule({
  declarations: [
    CreateJobPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateJobPage),
  ],
})
export class CreateJobPageModule {}
