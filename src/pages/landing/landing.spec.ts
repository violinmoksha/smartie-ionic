import { AppModule } from './../../app/app.module';
import { SmartieApp } from './../../app/app.component';
import { LandingPageModule } from './landing.module';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LandingPage } from './landing';
import { IonicPageModule, IonicModule, NavController} from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('Landing Page', () => {
 // let de: DebugElement;
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        IonicModule.forRoot(LandingPage),
        AppModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        AnalyticsProvider,
        NavController
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPage);
    console.log("Landing component");
    console.log(fixture)
    comp = fixture.componentInstance;
    //de = fixture.debugElement.query(By.css('ion-content'));
  });

  it('should create component', () => expect(comp instanceof LandingPage).toBeDefined());
});
