import {} from 'jasmine';
import { Page } from './app.po';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('landing page', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a first button saying I WANT TO LEARN', () => {
      page.getFirstButtonText().then(text => {
        expect(text).toEqual('I WANT TO LEARN');
      });
    });
  })
});
