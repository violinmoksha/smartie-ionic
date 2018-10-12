import { AnalyticsProvider } from "../providers/analytics";

export class AnalyticsMock extends AnalyticsProvider {
  async setScreenName(name){
    this.firebase.setScreenName(name);
  }

  getAnalyticEvent(eventName, eventAction){
    return {title:eventName, attributes:{action:eventAction}};
  }

  async addEvent(event) {
    this.firebase.logEvent(event.title, event.attributes);
  }

  async addUserProperty(){
    this.firebase.setUserProperty("role", "test");
  }

}
