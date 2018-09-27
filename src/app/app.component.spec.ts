import { } from 'jasmine';

import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { IonicStorageModule, Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';
import { HTTP } from '@ionic-native/http';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

import { PlatformMock } from '../mocks/platform';
import { StatusBarMock } from '../mocks/status-bar';
import { SplashScreenMock } from '../mocks/splash-screen';
import { GeolocationMock, Geoposition } from '../mocks/geolocation';
import { FirebaseMock } from '../mocks/firebase';
import { DeviceMock } from '../mocks/device';
import { HTTPMock } from '../mocks/http';
import { SecureStorageMock, SecureStorageObjectMock } from '../mocks/secure-storage';

import { DataService } from './app.data';

import { SmartieApp } from './app.component';

describe('SmartieApp Component', () => {
  let component: SmartieApp;
  let fixture: ComponentFixture<SmartieApp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartieApp],
      imports: [
        IonicModule.forRoot(SmartieApp),
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Geolocation, useClass: GeolocationMock },
        { provide: Firebase, useClass: FirebaseMock },
        { provide: Device, useClass: DeviceMock },
        { provide: HTTP, useClass: HTTPMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        DataService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartieApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("is created", () => {
    expect(fixture).toBeTruthy()
    expect(component).toBeTruthy()
  })

  it('should be instanced', () => {
    expect(component instanceof SmartieApp).toBeTruthy();
  });

  it('should have a storage service', () => {
    expect(component.storage instanceof Storage).toBeTruthy();
  });

  it('should have a device', () => {
    expect(component.device instanceof Device).toBeTruthy();
  });

  it('should have initGeolocation callThrough -capable', () => {
    let spy = spyOn(component, 'initGeolocation').and.callThrough();
    component.initGeolocation();
    expect(spy).toHaveBeenCalled();
  });

  it('should have initFirebase callThrough -capable', () => {
    let spy = spyOn(component, 'initFirebase').and.callThrough();
    component.initFirebase();
    expect(spy).toHaveBeenCalled();
  });

  it('should have initGeolocation throwError -capable', async(() => {
    let spy = spyOn(component, 'initGeolocation').and.throwError('problem');
    let ret;
    try {
      ret = component.initGeolocation();
    } catch (ex) {
      ret = false;
    }
    expect(ret).toBeFalsy();
  }));

  it('should have initGeolocation storing a Geoposition in storage', async(() => {
    const theResult: Geoposition = {
      "coords": {
        "latitude": 34.066386962709466,
        "longitude": -118.30588708704094,
        "accuracy": 65,
        "altitude": 67.53787994384766,
        "heading": -1,
        "speed": -1,
        "altitudeAccuracy": 10
      },
      "timestamp": 1534525964122.865
    };
    const spy = spyOn(component.storage, 'set');

    component.initGeolocation().then(resp => {
      expect(resp).toEqual(theResult);
      expect(spy).toHaveBeenCalledWith('phoneGeoposition', theResult);
    }, error => {
      expect(error).toBeDefined();
    });
  }));

  // it('should have initFirebase throwError -capable', async(() => {
  //   let spy = spyOn(component, 'initFirebase').and.throwError('problem'), ret;
  //
  //   try {
  //     ret = component.initFirebase();
  //   } catch (ex) {
  //     ret = false;
  //   }
  //   expect(ret).toBeFalsy();
  // }));

  it('should have initFirebase running to completion', () => {
    const token = 'ewCVcq2MitU:APA91bEoTcHJiPt8JjRkTsRjdo2isAuPvj8l5EziijcL7p_taK6IrSqAe9f9L3WvbbeUxMR743hEnqrM-RrTpwI-UO2wJVYK6MRLU7JpWVXnzzYa0ZdP6I4GzjHeO08I95VJWTcdD6Wk65ytAs-iGiqwGa9CgOWbzg';
    const tokenSpy = spyOn(component.firebase, 'getToken');
    const notificationSpy = spyOn(component.firebase, 'onNotificationOpen');

    component.initFirebase().then(data => {
      // expect(data).toEqual(token);
      expect(data).toEqual(jasmine.any(String))
      expect(tokenSpy).toHaveBeenCalled();
      expect(notificationSpy).toHaveBeenCalled();
    });
  });

});
