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
      this.isInternetConnected = false;
      toast.present();
    });
    this.network.onConnect().subscribe(() => {
      this.isInternetConnected = true;
      toast.dismiss();
    })
  }

  showToast(msg, closeButtonTxt = "close", closeCallback = undefined) {
    const toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: closeButtonTxt ? true : false,
      closeButtonText: closeButtonTxt
    });
    toast.onDidDismiss(() => {
      if(closeCallback)
      closeCallback();
    });
    toast.present();
  }

  chatToast(msg, closeButtonTxt = "close", closeCallback = undefined) {
    var toasters = document.getElementsByClassName("custom-chat-toast");
    console.log(toasters);
    if (toasters.length > 1){
        for (var i=1; i<toasters.length; i++){
          toasters[i].remove();
        }
    }

    const toast = this.toastCtrl.create({
      message: '',
      showCloseButton: closeButtonTxt ? true : false,
      closeButtonText: msg,
      cssClass:"custom-chat-toast"
    });
    toast.onDidDismiss(() => {
      if(closeCallback)
      closeCallback();
    });
    toast.present();
  }

}
