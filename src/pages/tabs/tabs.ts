import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  // providers: [ SmartieSearch ]
})
export class TabsPage {
  tab0Root: any = 'ListPage';
  tab1Root: any = 'SmartieSearch';
  tab2Root: any = 'PaymentDetailsPage';
  tab3Root: any = 'MyprofilePage';
  // tab4Root: any = 'NotificationFeedPage';
  tab4Root: any = 'ViewAppointmentPage';
  tab5Root: any = 'ChatRoomsPage';
  role: string;

  myIndex: number;

  pageTitle: string;
  fromWhere: any;
  rootParams: any = [];

  constructor(navParams: NavParams, public storage: Storage) {
    // Set the active tab based on the passed index from menu.ts
    this.myIndex = navParams.data.tabIndex || 0;
    this.role = navParams.get('role');
    this.fromWhere = navParams.get('fromWhere');
    this.rootParams = navParams.data;
  }
}
