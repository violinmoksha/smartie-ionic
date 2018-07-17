import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LauncherPage } from './launcher';

@NgModule({
  declarations: [
    LauncherPage,
  ],
  imports: [
    IonicPageModule.forChild(LauncherPage),
  ],
})
export class LauncherPageModule {}
