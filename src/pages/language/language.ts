import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  private userLang: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService, private menuCtrl: MenuController) {
    this.userLang = this.translate.currentLang;
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    console.log('ionViewDidLoad LanguagePage');
  }

  changeLanguage(lang){
    this.translate.use(lang);
    // localStorage.setItem("userLang",lang)
    // console.log(this.translate.currentLang);
    this.navCtrl.setRoot("LoginPage");
  }

}
