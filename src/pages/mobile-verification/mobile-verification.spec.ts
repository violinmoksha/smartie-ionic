import { AnalyticsMock } from './../../mocks/analytics';
import { Firebase } from '@ionic-native/firebase';
import { SecureStorageMock } from './../../mocks/secure-storage';
import { HTTPMock } from './../../mocks/http';
import { HTTP } from '@ionic-native/http';
import { SecureStorage } from '@ionic-native/secure-storage';
import { FirebaseMock } from './../../mocks/firebase';
import { Device } from '@ionic-native/device';
import { IonicStorageModule } from '@ionic/storage';
import { DataService } from './../../app/app.data';
import { AnalyticsProvider } from './../../providers/analytics';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { IonicModule, NavController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { MobileVerificationPage } from './mobile-verification';
import { DeviceMock } from '../../mocks/device';
import { FormBuilder } from '@angular/forms';
import { NavParamsMock, LoadingControllerMock, NavControllerMock } from 'ionic-mocks';

let de: DebugElement;
let el: HTMLElement;


let fixture: ComponentFixture<MobileVerificationPage> = null;
let comp: MobileVerificationPage;
describe("Mobile verification", () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MobileVerificationPage],
      providers: [
        { provide: AnalyticsProvider, useValue: AnalyticsMock, deps: [{provide:Firebase, useClass:FirebaseMock}] },
        { provide: DataService, useValue: DataService, deps: [SecureStorageMock, HTTPMock] },
        { provide: Device, useValue: DeviceMock },
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        FormBuilder
      ],
      imports: [
        IonicModule.forRoot(MobileVerificationPage),
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MobileVerificationPage);
    comp = fixture.componentInstance;

  }));

  it('should create fixture', () => {
    expect(fixture).toBeTruthy()
  })

  it("is created", () => {
    expect(comp instanceof MobileVerificationPage).toBeTruthy();
  });

  it("Verify Mobile number", inject([AnalyticsProvider], (analytics:AnalyticsProvider) =>{
    let analyticsSpy = spyOn(analytics, "addEvent").and.callThrough();
    comp.pushSignUp().then(res => {
        expect(analyticsSpy).toHaveBeenCalled();
    })
  }))
});
