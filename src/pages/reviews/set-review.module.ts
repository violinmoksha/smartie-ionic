import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetReview } from './set-review';

@NgModule({
  declarations: [
    SetReview,
  ],
  imports: [
    IonicPageModule.forChild(SetReview),
  ],
  exports: [
    SetReview
  ]
})
export class ReviewsPageModule {}
