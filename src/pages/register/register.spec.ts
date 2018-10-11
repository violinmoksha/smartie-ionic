import { NavMock } from './../../mocks/nav';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RegisterPage } from './register';
import { IonicModule, NavController } from 'ionic-angular';
import { FirebaseMock } from './../../mocks/firebase';

describe('Register Component', () => {
  var comp: RegisterPage;
  var fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [
        IonicModule.forRoot(RegisterPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: AnalyticsProvider, useValue: AnalyticsProvider, deps: [FirebaseMock] }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterPage);
    comp = fixture.componentInstance;
  }));

  it('should create fixture', () => {
    expect(fixture).toBeTruthy()
  })
  it('should create component', () => expect(comp).toBeDefined());

  it('should navigate to Mobileverification', async(inject([NavController], (navCtrl: NavController) => {
    let navSpy = spyOn(navCtrl, 'push').and.callThrough();
    comp.pushPage("teacher");
    setTimeout(() => {
      expect(navSpy).toHaveBeenCalledWith('RegisterStep1Page', { role: "teacher" })
    }, 1000)
  })));
});
