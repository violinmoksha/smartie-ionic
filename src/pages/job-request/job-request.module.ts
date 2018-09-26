import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobRequestPage } from './job-request';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    JobRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(JobRequestPage),
    IonicImageLoader
  ],
  exports: [
    JobRequestPage
  ]
})
export class JobRequestPageModule {}
