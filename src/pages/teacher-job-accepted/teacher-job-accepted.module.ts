import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeacherJobAcceptedPage } from './teacher-job-accepted';
 
@NgModule({
  declarations: [
    TeacherJobAcceptedPage,
  ],
  imports: [
    IonicPageModule.forChild(TeacherJobAcceptedPage),
  ],
  exports: [
    TeacherJobAcceptedPage
  ]
})
export class TeacherJobAcceptedPageModule {}
