import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the QrCodeScannerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()@Component({
  selector: 'page-qr-code-scanner',
  templateUrl: 'qr-code-scanner.html',
})
export class QrCodeScannerPage {

  scannedCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner){

  }

  scanCode(){
    this.barcodeScanner.scan().then((barcodeData) => {
     this.scannedCode = barcodeData.text;
    }, (err) => {
      // An error occurred
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCodeScannerPage');
  }

}
