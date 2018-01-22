import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobRequestsPage } from './job-requests';
 
@NgModule({
  declarations: [
    JobRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(JobRequestsPage),
  ],
  exports: [
    JobRequestsPage
  ]
})
export class JobRequestsPageModule {}
