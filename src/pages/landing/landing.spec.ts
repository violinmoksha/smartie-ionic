import { FirebaseMock } from './../../mocks/firebase';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LandingPage } from './landing';
import { IonicModule, NavController } from 'ionic-angular';
describe('Landing Page', () => {
  // let de: DebugElement;
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [
        IonicModule.forRoot(LandingPage)
      ],
      providers: [
        NavController,
        { provide: AnalyticsProvider, useValue: AnalyticsProvider, deps: [FirebaseMock] }
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

  it('view Did Load', inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    let setScreen = spyOn(comp, 'ionViewDidLoad').and.callThrough();
    //let addEvent = spyOn(analytics, 'addEvent').and.callThrough();
    fixture.detectChanges();
    expect(setScreen).toHaveBeenCalled();
    //  expect(addEvent).toHaveBeenCalled();
  }));

  it('should navigate to Mobileverification', async(inject([NavController], (navCtrl: NavController) => {
    let navSpy = spyOn(comp.navCtrl, 'push').and.callThrough();
    comp.pushMobVerify("Test Role");
    expect(navSpy).toHaveBeenCalled();
  })));
});
