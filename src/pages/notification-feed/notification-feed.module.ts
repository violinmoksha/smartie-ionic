import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationFeedPage } from './notification-feed';

@NgModule({
  declarations: [
    NotificationFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationFeedPage),
  ],
  exports: [
    NotificationFeedPage
  ]
})
export class NotificationFeedPageModule {}
