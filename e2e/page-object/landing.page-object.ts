import { browser, by, element, protractor } from 'protractor';

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

    // pushMobVerify(role){
    //     // browser.navigate("MobileVerificationPage", { role: role });
    //     browser.get("mobile-verification");
    // }


    urlChanged() {
        return browser.getCurrentUrl().then(function(url) {
            console.log(url);
            if(url != 'http://localhost:8100/#/landing'){
                console.log("True");
                return true;
            }else{
                console.log("False");
                return false;
            }
        });
    };
}