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

  tab0Root: any = 'SmartieSearch';
  tab1Root: any = 'PaymentDetailsPage';
  tab2Root: any = 'EditProfilePage';
  tab3Root: any = 'NotificationFeedPage';

  private tabs: any = [{ "tabRoot": '', "rootParams": '', "tabTitle": '', "tabIcon": ''}];
  private role: string;

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
