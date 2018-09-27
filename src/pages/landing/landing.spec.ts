import { SmartieApp } from './../../app/app.component';
import { NavParams } from 'ionic-angular';
// import { Firebase } from '@ionic-native/firebase';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By }           from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';
// import { LandingPage } from './landing';
// import { LandingPageModule } from './landing.module'
// import { IonicModule, Platform, NavController, NavParams} from 'ionic-angular/index';
// import { SmartieApp } from '../../app/app.component'
// import { NavMock } from '../../mocks/nav'
// import { MobileVerificationPage } from '../mobile-verification/mobile-verification';
// import { AnalyticsProvider } from '../../providers/analytics';

// describe('LandingPage', () => {

// let comp:LandingPage;
// let fixture: ComponentFixture<LandingPage>;
// let de: DebugElement;
// let el: HTMLElement;

// beforeEach(async(() => {
//   TestBed.configureTestingModule({
//     declarations: [LandingPage],
//     imports: [
//       LandingPageModule
//     ],
//     providers: [
//       {
//         provide:NavController,
//         useClass:NavMock
//       },
//       {
//         provide:AnalyticsProvider,
//         deps:[Firebase]
//       }
//     ]
//   }).compileComponents()
// }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LandingPage);
//     //comp = fixture.componentInstance;
//     console.log("********** comp *****");
//     comp = TestBed.get(LandingPage)
//     console.log(comp);
//   });
// it('should be instanced', () => {
//   console.log("********** compoo *****");
//   console.log(comp);
//   expect(comp instanceof LandingPage).toBeTruthy();
// });

//   it("Navigate to provision", ()=>{
//     let navCtrl = fixture.debugElement.injector.get(NavController);
//         spyOn(navCtrl, 'push');

//         de = fixture.debugElement.query(By.css('ion-buttons button'));

//         de.triggerEventHandler('click', null);

//         expect(navCtrl.push).toHaveBeenCalledWith(MobileVerificationPage);
//   })
// });

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LandingPage } from './landing';
import { IonicModule, Platform, NavController } from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AnalyticsProvider } from '../../providers/analytics';
import { Firebase } from '@ionic-native/firebase';

describe('Landing Component', () => {
  let de: DebugElement;
  let comp: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartieApp, LandingPage],
      imports: [
        IonicModule.forRoot(SmartieApp)
      ],
      providers: [
        { provide: NavController, useValue: {} },
        { provide: AnalyticsProvider, useValue: {}, deps: [Firebase] }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LandingPage);
    fixture.detectChanges();
    comp = fixture.componentInstance;
    //de = fixture.debugElement.query(By.css('ion-content'));
    console.log("****** landing test ******")
    console.log(comp)
  }));
  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('should create component', () => expect(comp).toBeDefined());
});
