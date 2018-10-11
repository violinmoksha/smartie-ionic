import { browser, protractor, element, by } from 'protractor';
import { LandingPageObject } from './page-object/landing.page-object';

describe('LandingPage', () => {
    let page: LandingPageObject;
  
    beforeEach(() => {
      page = new LandingPageObject();
    });
  
    describe('landing page', () => {
      beforeEach(() => {
        page.navigateTo('/#/landing');
      });
  
      it('should have a first button saying I WANT TO LEARN', () => {
        page.getFirstButtonText().then(text => {
          expect(text).toEqual('I WANT TO LEARN');
        });
      });
  
      it('should have a second button saying I WANT TO TEACH', () => {
        page.getSecondButtonText().then(text => {
          expect(text).toEqual('I WANT TO TEACH');
        });
      });

      it('should navigate to MOBILE VERIFICATION page on clicking any button', () => {
        let button = element.all(by.tagName('button')).first();
        let expected = browser.ExpectedConditions;
        browser.wait(expected.elementToBeClickable(button));
        button.click();
      });
    })
  });