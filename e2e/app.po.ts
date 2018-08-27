import { browser, by, element } from 'protractor';

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
}
