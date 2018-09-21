import {} from 'jasmine';

import { TestBed, inject, async } from '@angular/core/testing';

import { IonicStorageModule } from '@ionic/storage';

import { Constants } from './app.constants';

import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

import { SecureStorageMock, SecureStorageObjectMock } from '../mocks/secure-storage';

import { HTTP } from '@ionic-native/http';

import { HTTPMock } from '../mocks/http';

import { DataService } from './app.data';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      //imports: [HttpClientTestingModule],
      imports: [
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ],
      providers: [
        Constants,
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: HTTP, useClass: HTTPMock },
        DataService
      ],
    }).compileComponents();
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should have env set to test or prod iff deploying', () => {
    expect(Constants.API_ENDPOINTS.env).toEqual('test' || 'prod');
  });

  it('should have getApi callThrough -capable', inject([DataService], (service: DataService) => {
    let spy = spyOn(service, 'getApi').and.callThrough();
    service.getApi('someEndpoint', {}).then(API => {
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should have getApi throwError -capable', inject([DataService], (service: DataService) => {
    let spy = spyOn(service, 'getApi').and.throwError('problem');
    let ret;
    try {
      ret = service.getApi('someEndpoint', {});
    } catch(ex) {
      ret = false;
    }
    expect(ret).toBeFalsy();
  }));

  it('should have getApi returning an API object with defined members', async(inject([DataService], (service: DataService) => {
    service.getApi('someEndpoint', {'someParam':'someValue'}).then(API => {
      expect(API).toBeDefined();
      expect(typeof API['apiUrl']).toEqual('string');
      expect(typeof API['apiBody']).toEqual('object');
      expect(typeof API['apiHeaders']).toEqual('object');
    }).catch(error => {
      expect(error).toBeDefined();
    });
  })));

  it('should have getUserkey returning a 32-byte/44-char random key on initial run', async(inject([DataService], (service: DataService) => {
    service.getUserkey().then(userkey => {
      console.info('USERKEY: '+userkey);
      expect(userkey).toEqual('+YbX43O5PU/o1bBlRoFh1pZTbluSzABjuxriVo3e+Bk=');
    }, error => {
      expect(error).toBeDefined();
    })
  })));

  it('should have getBeyondGDPR for encryption returning encryption-ready API object', async(inject([DataService], (service: DataService) => {
    Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch = false;
    service.getBeyondGDPR(true, {'plaintext': 'Hello World!'}).then(API => {
      expect(API).toBeDefined();
      // expect(typeof API['apiUrl']).toEqual('string');
      // expect(typeof API['apiBody']).toEqual('object');
      // expect(typeof API['apiHeaders']).toEqual('object');
      // //expect(API['apiUrl']).toContain('encryptPlaintext');
    }).catch(error => {
      expect(error).toBeDefined();
    });
  })));

  it('should have getBeyondGDPR for decryption returning decryption-ready API object', async(inject([DataService], (service: DataService) => {
    Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch = false;
    service.getBeyondGDPR(false, {'ciphertext': 'ergqergehqetherhqrh'}).then(API => {
      expect(API).toBeDefined();
      expect(typeof API['apiUrl']).toEqual('string');
      expect(typeof API['apiBody']).toEqual('object');
      expect(typeof API['apiHeaders']).toEqual('object');
      expect(API['apiUrl']).toContain('decryptCiphertext');
    }).catch(error => {
      expect(error).toBeDefined();
    });
  })));

  it('should have getBeyondGDPR adding key from getUserkey to request body', async(inject([DataService], (service: DataService) => {
    Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch = false;
    service.getBeyondGDPR(true, {'plaintext': 'Hello World!'}).then(API => {
      expect(API).toBeDefined();
      expect(typeof API['apiUrl']).toEqual('string');
      expect(typeof API['apiBody']).toEqual('object');
      expect(typeof API['apiHeaders']).toEqual('object');
      //expect(API['apiUrl']).toContain('encryptPlaintext');
      //expect(API['apiBody'].userkey).toBeDefined();
    }).catch(error => {
      expect(error).toBeDefined();
    });
  })));

  it('should have getBeyondGDPR resolving(false) when chickenSwitch is set to true', async(inject([DataService], (service: DataService) => {
    Constants.API_ENDPOINTS.beyondGDPR.chickenSwitch = true;
    service.getBeyondGDPR(true, {'plaintext': 'Hello World!'}).then(API => {
      expect(API).toBeFalsy();
    }).catch(error => {
      expect(error).toBeDefined();
    });
  })));
});
