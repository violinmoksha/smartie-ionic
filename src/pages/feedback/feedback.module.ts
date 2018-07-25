import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
    Ionic2RatingModule
  ],
})
export class FeedbackPageModule {}
