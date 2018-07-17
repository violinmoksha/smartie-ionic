export class Constants {
  public static API_ENDPOINTS = {
    env: 'local',
    baseUrls: {
      prod: 'https://smartieapp.com',
      test: 'https://test.t0tl3s.com',
      // local: 'http://76.170.58.147:1337'
      local: 'http://172.16.4.159:1337'
    },
    paths: {
      fn: '/parse/functions',
      obj: '/parse/classes'
    },
    headers: {
      localAndTest: {
        applicationId: '948b9456-8c0a-4755-9e84-71be3723d338',
        contentType: 'application/json'
      },
      prod: {
        applicationId: '80f6c155-d26e-4c23-a96b-007cb4cba8e1',
        contentType: 'application/json'
      }
    },

    // TODO: modify these based on new backend
    /*
     * API Endpoints
     */
    // signup-related endpoints
    signupTeacher: '/signupTeacher',
    signupParentOrStudent: '/signupParentOrStudent',
    signupSchool: '/signupSchool',
    profileObject: '/Profile',

    // login
    loginUser: '/loginUser',
    forgotPassword: '/forgotPassword',
    totlesSearch: '/totlesSearch',
    getNotifyCount: '/getNotifyCount',
    totlesSearchRole: '/totlesSearchRole',
    createCustomer: '/createCustomer',
    createTransaction: '/createTransaction',

    //Job Request
    setJobRequest: '/setJobRequest',
    getAcceptedJobRequest: '/getAcceptedJobRequest',
    getRequestedJobRequest: '/getRequestedJobRequest',
    getAllAccepteds: '/getAllAccepteds',

    //Mailgun-integrated Endpoints
    sendFeedback: '/sendFeedback'
  }

  public static DEFAULT_LANGUAGE = 'en';
}
