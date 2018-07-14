#!/usr/bin/env node
'use strict';

/**
 * This hook makes sure projects using [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)
 * will build properly and have the required key files copied to the proper destinations when the app is build on Ionic Cloud using the package command.
 * Credits: https://github.com/arnesson.
 */
var fse = require('fs-extra');
var config = fse.readFileSync('config.xml').toString();
var name = getValue(config, 'name');
var configValues;

var IOS_DIR = 'platforms/ios';
var ANDROID_DIR = 'platforms/android';

if(fileExists('appconfig.json')){
  configValues = require('../appconfig.json');
  console.log("======Reading config json from after_prepare======");
  //updating gradle version
  updateGradlePluginVersion(configValues.android.gradlePluginVersion,configValues.android.gradleVersion);
  //updating project propeties, used to update dependencies version
  updateProjectProperties();
}else{
  console.log("***** config file not found from after_prepare ******");
}

function updateGradlePluginVersion (version, gVersion){
  try{
    //updating gradle builder 1st
    if(fileExists(ANDROID_DIR+'/cordova/lib/builders/GradleBuilder.js')){

      var gradleBuilder = fse.readFileSync(ANDROID_DIR+'/cordova/lib/builders/GradleBuilder.js').toString();
      var versionUrl = gradleBuilder.substr(gradleBuilder.search("'CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL'"), gradleBuilder.search("all.zip';"));
      versionUrl = versionUrl.replace(new RegExp('[0-9]+(.[0-9]+)*'),gVersion);
      gradleBuilder = gradleBuilder.replace(gradleBuilder.substr(gradleBuilder.search("'CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL'"), gradleBuilder.search("all.zip';")), versionUrl);
      fse.writeFileSync(ANDROID_DIR+'/cordova/lib/builders/GradleBuilder.js', gradleBuilder);

      if(fileExists(ANDROID_DIR+'/build.gradle') && fileExists(ANDROID_DIR+'/gradle/wrapper/gradle-wrapper.properties')){
        var strings = fse.readFileSync(ANDROID_DIR+'/build.gradle').toString();

        var gradleWrapperString = fse.readFileSync(ANDROID_DIR+'/gradle/wrapper/gradle-wrapper.properties').toString();
        var gradle = gradleWrapperString.substr(gradleWrapperString.search('distributionUrl'));

        gradle = gradle.replace(new RegExp('[0-9]+(.[0-9]+)*'),gVersion);
        gradleWrapperString = gradleWrapperString.replace(gradleWrapperString.substr(gradleWrapperString.search('distributionUrl')), gradle);

        strings = strings.replace(new RegExp('com.android.tools.build:gradle:[0-9]+(.[0-9]+)+(.[+]+)*'), 'com.android.tools.build:gradle:'+version);
        fse.writeFileSync(ANDROID_DIR+'/build.gradle', strings);

        fse.writeFileSync(ANDROID_DIR+'/gradle/wrapper/gradle-wrapper.properties', gradleWrapperString);
        }else{
          console.log("gradle file not found");
        }

    }


    }catch(e){
      console.log(e);
  }
}

function updateProjectProperties(){
  try{
    if(fileExists('build-config/android/project.properties')){
      var properties = fse.readFileSync('build-config/android/project.properties').toString();
      if(fileExists(ANDROID_DIR+'/project.properties')){
        fse.writeFileSync(ANDROID_DIR+'/project.properties', properties);
      }else{
        fse.writeFileSync(ANDROID_DIR+'/project.properties', properties)
      }
    }
  }catch(e){
    console.log(e);
  }
}

function getValue(config, name) {
    var value = config.match(new RegExp('<' + name + '>(.*?)</' + name + '>', 'i'));
    if (value && value[1]) {
        return value[1]
    } else {
        return null
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
