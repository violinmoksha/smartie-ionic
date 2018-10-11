import { NavMock } from './../../mocks/nav';
import { MobileVerificationPage } from './../mobile-verification/mobile-verification';
import { FirebaseMock } from './../../mocks/firebase';
import { DebugElement } from '@angular/core';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LandingPage } from './landing';
import { IonicModule, NavController } from 'ionic-angular';
import { By } from '@angular/platform-browser';

describe('Landing Page', () => {
  let de: DebugElement;
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [
        IonicModule.forRoot(LandingPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: AnalyticsProvider, deps: [FirebaseMock] }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(comp instanceof LandingPage).toBeDefined();
  });

  it('view Did Load', async(inject([AnalyticsProvider], (analytics: AnalyticsProvider) => {
    let setScreen = spyOn(comp.analytics, 'setScreenName').and.callThrough();
    comp.ionViewDidLoad();
    fixture.detectChanges();
    expect(setScreen).toHaveBeenCalled();
  })));

  it('should navigate to Mobileverification', async(inject([NavController], (navCtrl: NavController) => {
    let navSpy = spyOn(navCtrl, 'push').and.callThrough();
    comp.pushMobVerify("Test Role");
    setTimeout(()=>{
      expect(navSpy).toHaveBeenCalledWith('MobileVerificationPage',{ role: "Test Role" })
    }, 1000)
  })));

});
