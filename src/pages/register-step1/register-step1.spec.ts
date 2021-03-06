import { DataService } from './../../app/app.data';
import { LoadingControllerMock, NavParamsMock } from 'ionic-mocks';
import { NavMock } from './../../mocks/nav';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RegisterStep1Page } from './register-step1';
import { IonicModule, NavController, LoadingController, NavParams } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { FirebaseMock } from './../../mocks/firebase';

describe('Register step-1 Component', () => {
  var comp: RegisterStep1Page;
  var fixture: ComponentFixture<RegisterStep1Page>;
  var formData = {"email":"abc@mail.com", "password":"123456", "confPassword":"123456"};
  var spies;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterStep1Page],
      imports: [
        IonicModule.forRoot(RegisterStep1Page),
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: AnalyticsProvider, useValue: AnalyticsProvider, deps: [FirebaseMock] },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: DataService, useFactory: () => new DataService(null, null, null), deps: [] },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
      ]
    }).compileComponents();
    spies = jasmine.createSpyObj('DataService', ['getApi']);
    fixture = TestBed.createComponent(RegisterStep1Page);
    comp = fixture.componentInstance;
  }));

  it('should create fixture', () => {
    expect(fixture).toBeTruthy()
  })
  it('should create component', () => {
    expect(comp).toBeDefined();
  });

  it("Navigate to next step", async(inject([DataService], (dataService: DataService) => {
    comp.next(formData).then(res=>{
      expect(spies).toHaveBeenCalled();
    })
  })))

});
