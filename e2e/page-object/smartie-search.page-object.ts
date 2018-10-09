import { browser, element, by, ElementFinder } from 'protractor';

export class SmartieSearchObject {

  navigateTo(destination) {
    browser.ignoreSynchronization = true;
    return browser.get(destination);
  }

  findMap() {
    return element.all(by.css('#map'));
  }
}
