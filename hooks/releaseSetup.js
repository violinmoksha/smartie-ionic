'use strict';

/**
 * This hook makes sure projects using [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)
 * will build properly and have the required key files copied to the proper destinations when the app is build on Ionic Cloud using the package command.
 * Credits: https://github.com/arnesson.
 */
var fse = require('fs-extra');
var utils = require('./utils.js');
var ANDROID_DIR = 'platforms/android';

copyReleaseSigning();

function copyReleaseSigning() {
  if (utils.directoryExists('build-config')) {
    if (utils.fileExists('build-config/android/release-signing.properties')) {
      console.log("found release-signing.properties");
      var signingProperties = fse.readFileSync('build-config/android/release-signing.properties').toString();
      fse.writeFileSync(ANDROID_DIR + '/release-signing.properties', signingProperties);
    }
  } else {
    console.log("build directory not found");
  }
}
