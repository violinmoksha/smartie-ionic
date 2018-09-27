import { async, TestBed } from '@angular/core/testing';
import { AnalyticsProvider } from './analytics'
import { Firebase } from '@ionic-native/firebase';
describe("Analytics: Provider", () => {
  let analyticsService: AnalyticsProvider;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AnalyticsProvider', ['setScreenName']);
    TestBed.configureTestingModule({ providers: [{ provide: AnalyticsProvider, useValue: spy, deps: [Firebase] }] });
    analyticsService = TestBed.get(AnalyticsProvider);
  });

  it("should create", () => {
    expect(analyticsService).toBeTruthy();
  })

  it("creating analytics object", () => {
    let eventName = "test";
    let eventAction = "testaction";
    let eventObj = { title: eventName, attributes: { action: eventAction } }
    expect(analyticsService.getAnalyticEvent(eventName, eventAction)).toEqual(eventObj)
  })

})

