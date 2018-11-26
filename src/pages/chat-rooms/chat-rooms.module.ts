import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRoomsPage } from './chat-rooms';

@NgModule({
  declarations: [
    ChatRoomsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatRoomsPage),
  ],
})
export class ChatRoomsPageModule {}
