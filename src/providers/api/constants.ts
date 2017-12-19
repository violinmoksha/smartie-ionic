export class Constants {
  public static AUTH_EVENTS = {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  };

  public static USER_ROLES = {
    teacher: 'teacherRole',
    student: 'studentRole',
    parent: 'parentRole',
    school: 'schoolRole'
  };

  public static API_ENDPOINTS = {
    env: 'test',
    baseUrls: {
      prod: 'https://188.166.216.154',
      test: 'https://test.t0tl3s.com',
      local: 'http://localhost:1337'
    },
    paths: {
      fn: '/parse/functions',
      obj: '/parse/classes'
    },
    headers: {
      localAndTest: {
        applicationId: '948b9456-8c0a-4755-9e84-71be3723d338',
        masterKey: '49bc1a33-dfe7-4a32-bdcc-ee30b7ed8447',
        contentType: 'application/json'
      },
      prod: {
        applicationId: '80f6c155-d26e-4c23-a96b-007cb4cba8e1',
        masterKey: 'b36fdfbb-aad4-4967-8b4c-418108a449b3',
        contentType: 'application/json'
      }
    },

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
    getAllAccepteds: '/getAllAccepteds'
  }

  public static DEFAULT_LANGUAGE = 'en';
}
