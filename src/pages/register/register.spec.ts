import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RegisterPage } from './register';
import { NavController } from 'ionic-angular/index';

describe('Register Component', () => {
  let de: DebugElement;
  var comp: RegisterPage;
  var fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      providers: [
        NavController,
        AnalyticsProvider
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-content'));

  }));

  it('should create fixture',()=>{
    expect(fixture).toBeTruthy()
  })
  it('should create component', () => expect(comp).toBeDefined());
});
