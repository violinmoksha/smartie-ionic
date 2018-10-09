import { browser, element, by, ElementFinder } from 'protractor';

export class LoginPageObject {

  navigateTo(destination) {
    browser.ignoreSynchronization = true;
    return browser.get(destination);
  }

  getKeyInput() {
    return element.all(by.css('.list .list-inset ion-input'));
  }

  getLoginButton() {
    return element.all(by.css('.button button-positive'));
  }

}
