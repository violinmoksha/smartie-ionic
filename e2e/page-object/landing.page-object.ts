import { browser, by, element } from 'protractor';

export class LandingPageObject {

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
}