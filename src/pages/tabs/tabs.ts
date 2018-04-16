import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SmartieSearch } from '../smartie-search/smartie-search';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  providers: [ SmartieSearch ]
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

  constructor(navParams: NavParams, public storage: Storage, private smartieSearch: SmartieSearch) {
    // Set the active tab based on the passed index from menu.ts
    this.myIndex = navParams.data.tabIndex || 0;
    this.role = navParams.data.role;
    this.fromWhere = { fromWhere: navParams.data.fromWhere };

    if(this.role == 'teacher'){
      this.tabs = [
        { tabRoot: 'SmartieSearch', "rootParams": 'this.fromWhere', tabTitle: 'Search', tabIcon: 'search' },
        { tabRoot: 'PaymentDetailsPage', tabTitle: 'Payment', tabIcon: 'card' },
        { tabRoot: 'EditProfilePage', tabTitle: 'Edit Profile', tabIcon: 'settings' },
        { tabRoot: 'NotificationFeedPage', tabTitle: 'Notifications', tabIcon: 'md-notifications' }
      ]
    }else{
      this.tabs = [
        { tabRoot: 'SmartieSearch', tabTitle: 'Search', tabIcon: 'search' },
        { tabRoot: 'EditProfilePage', tabTitle: 'Edit Profile', tabIcon: 'settings' },
        { tabRoot: 'NotificationFeedPage', tabTitle: 'Notifications', tabIcon: 'md-notifications' }
      ]
    }
  }
}
