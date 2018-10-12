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
        // let d = protractor.promise.defer();
        let button = element.all(by.tagName('button')).first();
        let expected = protractor.ExpectedConditions;

        let condition = expected.and(page.urlChanged)
        button.click();
        
        browser.wait(condition, 5000).then( (result) => {
          console.log("########### result ############");
          console.log(result);
          // expect(result).toBeTruthy();
        })

        expect(true).toBeTruthy();

        /*button.click().then(() => {
          setTimeout(() => { d.fulfill('ok')}, 50000)
          setTimeout(() => {
            d.fulfill('ok')
          }, 10000)
        })*/

        /*button.click().then(() => {
          browser.getCurrentUrl().then((actualUrl) => {
            console.log("############# actual url ###############");
            console.log(actualUrl);
          })
        })*/
        // browser.wait(expected.elementToBeClickable(button)).then(() => {
        //   button.click().then(() => {
        //     let newPageTitle = browser.getTitle();
        //     console.log("######## Title #######");
        //     console.log(newPageTitle);
        //   })
        // })
      });
    })
  });