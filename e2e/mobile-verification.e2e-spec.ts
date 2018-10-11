import { browser, protractor, element, by } from 'protractor';
import { MobileVerificationPageObject } from './page-object/mobile-verification.page-objects';

describe('Mobile Verification Page', () => {
    let page: MobileVerificationPageObject;
  
    beforeEach(() => {
      page = new MobileVerificationPageObject();
    });
  
    describe('mobile verification page', () => {
      beforeEach(() => {
        page.navigateTo('/#/mobile-verification');
      });
  
      it('should have a title saying Smartie', () => {
        page.getTitle().then(text => {
          expect(text).toEqual('Smartie');
        });
      });
    });
  });