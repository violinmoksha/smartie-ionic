//var fse = require('fs-extra');
import fse from 'fs-extra';

export class Constants {
  public static API_ENDPOINTS = {
    env: 'test',
    beyondGDPR: {
      chickenSwitch: false,
      baseUrl: "https://test.t0tl3s.com:3001",
      paths: {
        encrypt: "/encryptPlaintext",
        decrypt: "/decryptCiphertext"
      }
    },
    baseUrls: {
      prod: 'https://smartieapp.com',
      test: 'https://test.t0tl3s.com',
      // local: 'http://76.170.58.147:1337'
      local: 'http://172.16.4.159:1337'
      //local: 'http://172.16.1.179:1337'
     // local: 'https://24ec78d5.ngrok.io'
    },
    paths: {
      fn: '/parse/functions',
      obj: '/parse/classes'
    },
    headers: {
      localAndTest: {
        applicationId: '948b9456-8c0a-4755-9e84-71be3723d338',
        contentType: 'application/json'
      },
      prod: {
        applicationId: '80f6c155-d26e-4c23-a96b-007cb4cba8e1',
        contentType: 'application/json'
      }
    }
  }

  // public static firebaseValues = JSON.parse(fse.readFileSync('../../google-services.json'));
  public static firebaseConfig = {
    production: false,
    firebase: {
      // apiKey: 'AIzaSyCwovXgTeaJ38sVOrGNQi-TJph8SVH1D0U',
      // authDomain: 'https://smartie-212716.firebaseio.com',
      // databaseURL: 'https://smartie-212716.firebaseio.com',
      // projectId: 'smartie-212716',
      // storageBucket: 'smartie-212716.appspot.com',
      // messagingSenderId: '500059309895'
      apiKey: "AIzaSyDEBhIe2qHmyQptDMiq4llXFdyRRBuKWoc",
      authDomain: "smartie-212716.firebaseapp.com",
      databaseURL: "https://smartie-212716.firebaseio.com",
      projectId: "smartie-212716",
      storageBucket: "smartie-212716.appspot.com",
      messagingSenderId: "500059309895"
    }
  };
}
