import { } from 'jasmine';
import { Page } from './app.po';
import { browser } from 'protractor';
describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('landing page', () => {
    beforeEach(() => {
      page.navigateTo('/');
      browser.driver.sleep(500);
    });

    it('should have a first button saying I WANT TO LEARN', () => {
      page.checkButtonText().then(text => {
        console.log("++++++++++++++++++++++++");
        console.log(text);
        expect(text).toEqual('I WANT TO LEARN');
      }, err => {
        console.log("___________________");
        console.log("EROROR" + err)
      });
    });
  })
});
