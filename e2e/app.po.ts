import { browser, by, element } from 'protractor';
import { By } from 'selenium-webdriver';

export class Page {

  navigateTo(destination) {
    browser.ignoreSynchronization = true;
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getFirstButtonText() {
    return element.all(by.tagName('button p')).first().getText();
  }

  getSecondButtonText() {
    return element.all(by.tagName('button p')).get(1).getText();
  }

  // checkButtonText() {
  //   return element(by.tagName('page-landing')).element(by.css('.button p')).getText();
  // }
}
