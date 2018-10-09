import { browser, protractor } from 'protractor';
import { LoginPageObject } from './page-object/login.page-object';
import { SmartieSearchObject } from "./page-object/smartie-search.page-object";
describe('Login', () => {

  let loginPage: LoginPageObject;
  let smartieSearch: SmartieSearchObject;

  beforeEach(() => {
    loginPage = new LoginPageObject();
    smartieSearch = new SmartieSearchObject();
    loginPage.navigateTo('login')
  });

  it('a user should be able to reach the home page by providing a valid license key', () => {
    let input = loginPage.getKeyInput();
    let loginButton = loginPage.getLoginButton();
    input.sendKeys('123456');
    loginButton.click();
    browser.wait(protractor.ExpectedConditions.urlContains('smartie-search'));
    expect<any>(smartieSearch.findMap()).toBeTruthy();
  });

});
