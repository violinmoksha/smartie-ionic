import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestingPage } from './testing';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    TestingPage,
  ],
  imports: [
    IonicPageModule.forChild(TestingPage),
    Ionic2RatingModule
  ],
})
export class TestingPageModule {}
