#!/usr/bin/env node
'use strict';

/**
 * This hook makes sure projects using [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)
 * will build properly and have the required key files copied to the proper destinations when the app is build on Ionic Cloud using the package command.
 * Credits: https://github.com/arnesson.
 */
var fse = require('fs-extra');

var IOS_DIR = 'platforms/ios';
var ANDROID_DIR = 'platforms/android';
let configValues;




function updateBundleUrl (url){
  console.log("url changes");
  console.log(url);
  if(fileExists(ANDROID_DIR+'/app/src/main/java/com/smartie/app/MainActivity.java')){
    var bundleUrlChanger = fse.readFileSync(ANDROID_DIR+'/app/src/main/java/com/smartie/app/MainActivity.java').toString();
    bundleUrlChanger = bundleUrlChanger.replace('loadUrl(launchUrl);' , 'loadUrl("'+url+'");');
    console.log(bundleUrlChanger);
    fse.writeFileSync(ANDROID_DIR+'/app/src/main/java/com/smartie/app/MainActivity.java', bundleUrlChanger);

  }
}
if(fileExists('appconfig.json')){
  configValues = require('../appconfig.json');
  console.log("config values");
  console.log(configValues);
  if(configValues.android.bundleUrl){
    updateBundleUrl(configValues.android.bundleUrl);
  }
}


function fileExists(path) {
  try {
      return fse.statSync(path).isFile();
  } catch (e) {
      return false;
  }
}

function directoryExists(path) {
  try {
      return fse.statSync(path).isDirectory();
  } catch (e) {
      return false;
  }
}
