import { HTTP } from '@ionic-native/http';

export interface HTTPResponse {
    /**
     * The status number of the response
     */
    status: number;
    /**
     * The headers of the response
     */
    headers: any;
    /**
     * The URL of the response. This property will be the final URL obtained after any redirects.
     */
    url: string;
    /**
     * The data that is in the response. This property usually exists when a promise returned by a request method resolves.
     */
    data?: any;
    /**
     * Error response from the server. This property usually exists when a promise returned by a request method rejects.
     */
    error?: string;
}

export class HTTPMock extends HTTP {
    /**
     * This returns an object representing a basic HTTP Authorization header of the form.
     * @param username {string} Username
     * @param password {string} Password
     * @returns {Object} an object representing a basic HTTP Authorization header of the form {'Authorization': 'Basic base64encodedusernameandpassword'}
     */
    getBasicAuthHeader(username: string, password: string): {
        Authorization: string;
    } {
        return { Authorization: '' };
    };
    /**
     * This sets up all future requests to use Basic HTTP authentication with the given username and password.
     * @param username {string} Username
     * @param password {string} Password
     */
    useBasicAuth(username: string, password: string): void {};
    /**
     * Set a header for all future requests. Takes a header and a value.
     * @param header {string} The name of the header
     * @param value {string} The value of the header
     */
    setHeader(header: string, value: string): void {};
    /**
     * Enable or disable SSL Pinning. This defaults to false.
     *
     * To use SSL pinning you must include at least one .cer SSL certificate in your app project. You can pin to your server certificate or to one of the issuing CA certificates. For ios include your certificate in the root level of your bundle (just add the .cer file to your project/target at the root level). For android include your certificate in your project's platforms/android/assets folder. In both cases all .cer files found will be loaded automatically. If you only have a .pem certificate see this stackoverflow answer. You want to convert it to a DER encoded certificate with a .cer extension.
     *
     * As an alternative, you can store your .cer files in the www/certificates folder.
     * @param enable {boolean} Set to true to enable
     * @returns {Promise<any>} returns a promise that will resolve on success, and reject on failure
     */
    enableSSLPinning(enable: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };
    /**
     * Accept all SSL certificates. Or disabled accepting all certificates. Defaults to false.
     * @param accept {boolean} Set to true to accept
     * @returns {Promise<any>} returns a promise that will resolve on success, and reject on failure
     */
    acceptAllCerts(accept: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };
    /**
     * Whether or not to validate the domain name in the certificate. This defaults to true.
     * @param validate {boolean} Set to true to validate
     * @returns {Promise<any>} returns a promise that will resolve on success, and reject on failure
     */
    validateDomainName(validate: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };
    /**
     * Make a POST request
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    post(url: string, body: any, headers: any): Promise<HTTPResponse> {
        let response = <HTTPResponse>{};
        return new Promise((resolve, reject) => {
            if (url.search('updateFcmToken')) {
              response.status = 200;
              response.data = {};
            } else if (url.search('getUserProvision')) {
              response.status = 200;
              response.data = {
                "result": {
                    "provision": {
                        "device": {},
                        "uuid": "60EBA174-336A-4A9C-A382-4B06411C408C",
                        "role": "teacher",
                        "useMasterKey": true,
                        "createdAt": "2018-07-25T23:17:56.684Z",
                        "updatedAt": "2018-07-25T23:17:56.709Z",
                        "fcmData": {
                            "__type": "Pointer",
                            "className": "FcmData",
                            "objectId": "w06pXrHLWq"
                        },
                        "objectId": "fJGgrNlujO",
                        "__type": "Object",
                        "className": "Provision"
                    },
                    "pToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2UiOnt9LCJ1dWlkIjoiNjBFQkExNzQtMzM2QS00QTlDLUEzODItNEIwNjQxMUM0MDhDIiwicm9sZSI6InRlYWNoZXIiLCJ1c2VNYXN0ZXJLZXkiOnRydWUsImNyZWF0ZWRBdCI6IjIwMTgtMDctMjVUMjM6MTc6NTYuNjg0WiIsInVwZGF0ZWRBdCI6IjIwMTgtMDctMjVUMjM6MTc6NTYuNzA5WiIsImZjbURhdGEiOnsiX190eXBlIjoiUG9pbnRlciIsImNsYXNzTmFtZSI6IkZjbURhdGEiLCJvYmplY3RJZCI6IncwNnBYckhMV3EifSwib2JqZWN0SWQiOiJmSkdnck5sdWpPIiwiaWF0IjoxNTM1MTYzMjIyfQ.20ZkKodQSIfg86lgZ7rdwpjsLw3OhwgRVQ_1KGRB-xc"
                }
              };
            } else if (url.search('getJobRequestById')) {
              response.status = 200;
              response.data = {
                  "result": {
                      "otherProfile": {
                          "latlng": {
                              "__type": "GeoPoint",
                              "latitude": 34.03330962375265,
                              "longitude": -118.19906218897168
                          },
                          "fullname": "Ramesh",
                          "profileTitle": "Testingdone",
                          "profileAbout": "Test message from you",
                          "prefLocation": "Los Angeles, CA, USA",
                          "prefPayRate": 5,
                          "notifyCount": 0,
                          "role": "student",
                          "user": {
                              "__type": "Pointer",
                              "className": "_User",
                              "objectId": "w09FIldQ2L"
                          },
                          "useMasterKey": true,
                          "createdAt": "2018-08-15T05:34:08.462Z",
                          "updatedAt": "2018-08-15T06:40:33.589Z",
                          "hasJobRequest": true,
                          "ACL": {
                              "*": {
                                  "read": true,
                                  "write": true
                              }
                          },
                          "objectId": "boLM8cWTFB",
                          "__type": "Object",
                          "className": "Profile"
                      },
                      "teacherProfile": {
                          "latlng": {
                              "__type": "GeoPoint",
                              "latitude": 34.043146074542854,
                              "longitude": -118.28584665458064
                          },
                          "phone": "(252) 235-8335",
                          "fullname": "Paul y",
                          "profileTitle": "Title",
                          "profileAbout": "Msg",
                          "prefLocation": "Los Angeles, CA, USA",
                          "prefPayRate": 45,
                          "notifyCount": 0,
                          "role": "teacher",
                          "user": {
                              "__type": "Pointer",
                              "className": "_User",
                              "objectId": "gVnhwnwAhN"
                          },
                          "useMasterKey": true,
                          "createdAt": "2018-07-25T20:10:35.550Z",
                          "updatedAt": "2018-07-25T20:10:42.846Z",
                          "hasJobRequest": true,
                          "profilePhoto": {
                              "__type": "File",
                              "name": "e0c6e74283a85ab704ec3a985122f62d_photo.jpg",
                              "url": "https://test.t0tl3s.com/parse/files/948b9456-8c0a-4755-9e84-71be3723d338/e0c6e74283a85ab704ec3a985122f62d_photo.jpg"
                          },
                          "ACL": {
                              "*": {
                                  "read": true,
                                  "write": true
                              }
                          },
                          "objectId": "sOm8hJExsN",
                          "__type": "Object",
                          "className": "Profile"
                      },
                      "requestSent": false,
                      "acceptState": false,
                      "teacher": {
                          "defaultStartDateTime": {
                              "__type": "Date",
                              "iso": "2018-07-25T17:00:00.000Z"
                          },
                          "defaultEndDateTime": {
                              "__type": "Date",
                              "iso": "2019-07-26T05:00:00.000Z"
                          },
                          "yrsExperience": 5,
                          "profile": {
                              "__type": "Pointer",
                              "className": "Profile",
                              "objectId": "sOm8hJExsN"
                          },
                          "user": {
                              "__type": "Pointer",
                              "className": "_User",
                              "objectId": "gVnhwnwAhN"
                          },
                          "useMasterKey": true,
                          "createdAt": "2018-07-25T20:10:35.575Z",
                          "updatedAt": "2018-07-25T20:10:35.575Z",
                          "ACL": {
                              "*": {
                                  "read": true,
                                  "write": true
                              }
                          },
                          "objectId": "kQq7EWnbdR",
                          "__type": "Object",
                          "className": "Teacher"
                      },
                      "useMasterKey": true,
                      "createdAt": "2018-08-15T05:34:09.360Z",
                      "updatedAt": "2018-08-15T05:34:09.360Z",
                      "objectId": "TkcqH6oSQ5",
                      "__type": "Object",
                      "className": "JobRequest"
                  }
              };
            }
            resolve(response);
        });
    };
    /**
     *
     * @param url {string} The url to send the request to
     * @param parameters {Object} Parameters to send with the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    get(url: string, parameters: any, headers: any): Promise<HTTPResponse> {
        let response: HTTPResponse;
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    };
    /**
     *
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @param filePath {string} The local path of the file to upload
     * @param name {string} The name of the parameter to pass the file along as
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    uploadFile(url: string, body: any, headers: any, filePath: string, name: string): Promise<HTTPResponse> {
        let response: HTTPResponse;
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    };
    /**
     *
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @param filePath {string} The path to donwload the file to, including the file name.
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    downloadFile(url: string, body: any, headers: any, filePath: string): Promise<HTTPResponse> {
        let response: HTTPResponse;
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    };
}
