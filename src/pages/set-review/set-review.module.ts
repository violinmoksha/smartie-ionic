import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetReviewPage } from './set-review';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    SetReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(SetReviewPage),
    Ionic2RatingModule
  ],
})
export class SetReviewPageModule {}
