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

    // initial check for network detection
    if(this.network.Connection.NONE === this.network.type){
      toast.present();
    }

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
    try{
      if (toasters.length >= 1){
          for (var i=toasters.length-2; i>=0; i--){
            console.log("toaster index", i);
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
    }catch(e){
      console.log(e);
    }

  }

}
