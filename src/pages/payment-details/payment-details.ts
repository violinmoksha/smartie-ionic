import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PaymentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {

  private userRole: string;
  private fullName: any;
  private registeredWithStripe: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {

  }

  ionViewDidLoad() {
    this.storage.get('UserProfile').then(UserProfile => {
      this.userRole = UserProfile.profileData.role;
      this.fullName = UserProfile.profileData.fullname;
      /*if(UserProfile.profileData.stripeCustomer.id){
        this.registeredWithStripe = true;
      }*/
    });
  }

  addPayment(){
    this.navCtrl.push('AddPaymentPage', { fromWhere: 'teacher' });
  }

}
