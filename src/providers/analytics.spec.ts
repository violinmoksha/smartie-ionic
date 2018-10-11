import { async, TestBed, inject } from '@angular/core/testing';
import { AnalyticsProvider } from './analytics'
import { Firebase } from '@ionic-native/firebase';
import { FirebaseMock } from '../mocks/firebase';

describe("Analytics: Provider", () => {
  let analyticsService: AnalyticsProvider;
  let eventName = "test";
  let eventAction = "testaction";
  let eventObj = { title: eventName, attributes: { action: eventAction } };
  var analyticSpy;
  beforeEach(async(() => {
    //analyticSpy = jasmine.createSpyObj('AnalyticsProvider', ['setScreenName']);
    TestBed.configureTestingModule({
      providers: [
        AnalyticsProvider,
        Firebase]
    }).compileComponents();
  }));

  it('should be created', inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    expect(analyticsService).toBeTruthy();
  }));

  it("creating analytics object", inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    const eventSpy = spyOn(analyticsService, 'getAnalyticEvent').and.callThrough();
    let eventValue = analyticsService.getAnalyticEvent(eventName, eventAction);
    expect(eventSpy).toHaveBeenCalled();
    expect(eventValue).toBeDefined()
    expect(eventValue).toEqual(eventObj)
  }));

  it('should have addEvent callThrough -capable', inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    const spyFirebase = spyOn(analyticsService.firebase, 'logEvent').and.callThrough();
    analyticsService.addEvent(event).then(() => {
      expect(spyFirebase).toHaveBeenCalled();
    });
  }));

  it('should have addUserProperty callThrough -capable', inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    const spyFirebase = spyOn(analyticsService.firebase, 'setUserProperty').and.callThrough();
    analyticsService.addUserProperty().then(() => {
      expect(spyFirebase).toHaveBeenCalled();
    });
  }));

  it('should have setScreenName callThrough -capable', inject([AnalyticsProvider], (analyticsService: AnalyticsProvider) => {
    const spyFirebase = spyOn(analyticsService.firebase, 'setScreenName').and.callThrough();
    analyticsService.setScreenName("spec tests").then(() => {
      expect(spyFirebase).toHaveBeenCalled();
    });
  }));

});

