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
    return element(by.tagName('page-landing')).element(by.tagName('p')).getText();
  }

  checkButtonText() {
    return element(by.tagName('page-landing')).element(by.css('.button p')).getText();
  }
}
