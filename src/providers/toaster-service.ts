import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
/*
  Generated class for the ToasterServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToasterServiceProvider {

  public isInternetConnected: Boolean = true;

  constructor(public toastCtrl: ToastController, private network: Network) {
    console.log('Hello ToasterServiceProvider Provider');
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000
    });
    toast.present();
  }

  internetListener() {
    const toast = this.toastCtrl.create({
      message: 'You are offline, Please check your internet connection!',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'OK'
    });
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.isInternetConnected = false;
      toast.present();
    });
    this.network.onConnect().subscribe(() => {
      this.isInternetConnected = true;
      toast.dismiss();
    })
  }

}