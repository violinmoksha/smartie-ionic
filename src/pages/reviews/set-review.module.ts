import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetReview } from './set-review';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [
    SetReview,
  ],
  imports: [
    IonicPageModule.forChild(SetReview),
    StarRatingModule.forRoot(),
  ],
  exports: [
    SetReview
  ]
})
export class ReviewsPageModule {}
