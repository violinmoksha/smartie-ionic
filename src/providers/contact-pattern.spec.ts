import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { ContactPatterns } from './contact-patterns';
let contactPattern: ContactPatterns;
let instance: any = null;

describe('personal info breacher in PM!', function () {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactPatterns
      ]
    }).compileComponents();
  }));
  let cases = [
    "yah just contact me at myemail at gmail dot com",
    "just call me at 510-234-9876",
    "just call me at five ten zero two three 4-98 seven six",
    "poke me on my facebook id ramesh",
    "Hey how are you?",
    "Hey its my kik - 1213rko",
    "hey tweet me @rko98",
    "Hey follow me on insta @rko129",
    "Hey ping me on snapchat @rko",
    "Hey ping me on whatsapp 1234567890"
  ]
  var outputValues = [false, false, false, false, true, false, false, false, false, false];

  it('should be created', inject([ContactPatterns], (contactPattern: ContactPatterns) => {
    expect(contactPattern).toBeTruthy();
  }));

  function testMyInputs(input, output) {
    it('matching text in chats input = ' + input + ' Expected output tobe = ' + output, function (done) {
      inject([ContactPatterns], (contactPattern: ContactPatterns) => {
        contactPattern.allowedInput(input).then((result) => {
          expect(result).toEqual(output);
          done();
        })
      })();
    });
  }

  for (var x = 0; x < cases.length; x++) {
    testMyInputs(cases[x], outputValues[x]);
  }
});
