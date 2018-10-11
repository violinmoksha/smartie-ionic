import { browser, by, element } from 'protractor';

export class MobileVerificationPageObject {

    navigateTo(destination) {
        browser.ignoreSynchronization = true;
        return browser.get(destination);
    }

    getTitle() {
        return browser.getTitle();
    }
}