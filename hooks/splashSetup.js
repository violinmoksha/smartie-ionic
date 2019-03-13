'use strict';

var fse = require('fs-extra');
var utils = require('./utils.js');
var ANDROID_DIR = 'platforms/android';
var configValues = {};

createDrawable();
// removeCordovaSplash();

// function removeCordovaSplash(){
//   let config = fse.readFileSync('config.xml').toString();
//   config = config.replace('<preference name="SplashScreen" value="screen" />', '<preference name="SplashScreen" value="none" />');
//   fse.writeFile('config.xml', config, function(err){
//     console.log("*** write file***");
//     console.log(err);
//   });
// }

function createDrawable() {
  console.log(" **** Running hooks ******")
  fse.ensureDir(ANDROID_DIR + "/app/src/main/res/drawable", err => {
    fse.copy("build-config/android/splash_window.xml", ANDROID_DIR + "/app/src/main/res/drawable/splash_window.xml", err => {
      setStyles();
      copySplashImage();
    })
  })
}

function setStyles() {
  fse.copy("build-config/android/styles.xml", ANDROID_DIR + "/app/src/main/res/values/styles.xml", err => {
    console.log(err);
    updateThemeInManifest();
  })
}

function updateThemeInManifest() {
  if (utils.fileExists("appconfig.json")) {
    configValues = require('../appconfig.json');
    let manifestString = fse.readFileSync(ANDROID_DIR + "/app/src/main/AndroidManifest.xml").toString();
    let temp = manifestString.substr(manifestString.indexOf("android:theme="));
    temp = temp.substr(0, temp.indexOf(" "));
    manifestString = manifestString.replace(temp, 'android:theme="' + configValues.android.theme + '"');
    fse.writeFileSync(ANDROID_DIR + "/app/src/main/AndroidManifest.xml", manifestString);
  }
}

function copySplashImage() {
  console.log("************ copying splash image *****************");
  fse.copy("resources/splash.png", ANDROID_DIR + "/app/src/main/res/drawable/screen.png", err => {
    console.log(err);
  })
}
