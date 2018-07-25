'use strict';

/**
 * This hook makes sure projects using [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)
 * will build properly and have the required key files copied to the proper destinations when the app is build on Ionic Cloud using the package command.
 * Credits: https://github.com/arnesson.
 */
var fse = require('fs-extra');

exports.fileExists = (path)=> {
  try {
      return fse.statSync(path).isFile();
  } catch (e) {
      return false;
  }
}

exports.directoryExists=(path)=> {
  try {
      return fse.statSync(path).isDirectory();
  } catch (e) {
      return false;
  }
}
