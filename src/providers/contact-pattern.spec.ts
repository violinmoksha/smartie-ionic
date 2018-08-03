
import { ComponentFixture, async } from '@angular/core/testing';
// import { TestUtils } from '@tests/test';

import { ContactPatterns } from './contact-patterns';
let cases = [
  "yah just contact me at myemail at gmail dot com",
  "just call me at 510-234-9876",
  "just call me at five ten zero two three 4-98 seven six"
]
let contactPattern: ContactPatterns;
let instance: any = null;

describe('personal info breacher in PM', function() {
  it('checking for phone', async function() {
    contactPattern = new ContactPatterns();
      let result = await contactPattern.allowedInput("yah just contact me at myemail at gmail dot com");
      expect(result).toEqual(false);
  });
});
