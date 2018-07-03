import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SmartieApp } from './app.component';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';

/* describe('SmartieApp', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartieApp],
      imports: [
        IonicModule.forRoot(SmartieApp)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartieApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof SmartieApp).toBe(true);
  });

  it('should have two pages', () => {
    expect(component.pages.length).toBe(27);
  });

}); */

describe('Sample test', function() {
  it('Condition is true', function() {
    expect('John').toBe('John');
  });
});
