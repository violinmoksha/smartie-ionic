#!/usr/bin/env node

'use strict';

/**
 * This hook makes sure projects using [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)
 * will build properly and have the required key files copied to the proper destinations when the app is build on Ionic Cloud using the package command.
 * Credits: https://github.com/arnesson.
 */
var fse = require('fs-extra');
var utils = require('./utils.js');

var IOS_DIR = 'platforms/ios';
var ANDROID_DIR = 'platforms/android';
let configValues;

function updateBundleUrl(url) {
  if (utils.fileExists(ANDROID_DIR + '/app/src/main/java/com/smartie/app/MainActivity.java')) {
    var bundleUrlChanger = fse.readFileSync(ANDROID_DIR + '/app/src/main/java/com/smartie/app/MainActivity.java').toString();
    //bundleUrlChanger = bundleUrlChanger.replace('loadUrl(launchUrl);', 'loadUrl("'+url+'");');
    if (bundleUrlChanger.indexOf("loadUrl(launchUrl);") != -1) {
      bundleUrlChanger = bundleUrlChanger.replace('loadUrl(launchUrl);', 'loadUrl("' + url + '");');
    } else {
      var start = bundleUrlChanger.indexOf('loadUrl("');
      var temp = bundleUrlChanger.substr(start);
      var end = temp.lastIndexOf('");');
      temp = temp.substr(0, end);
      bundleUrlChanger = bundleUrlChanger.replace(temp, 'loadUrl("' + url);
    }
    fse.writeFileSync(ANDROID_DIR + '/app/src/main/java/com/smartie/app/MainActivity.java', bundleUrlChanger);

  }
}
if (utils.fileExists('appconfig.json')) {
  configValues = require('../appconfig.json');
  if (configValues.android.bundleUrl) {
    updateBundleUrl(configValues.android.bundleUrl);
  }
}
