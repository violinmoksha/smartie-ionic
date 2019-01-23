'use strict';

var fse = require('fs-extra');
var utils = require('./utils.js');
var iOS_DIR = 'platforms/ios';

removeForgroundNotification();

function removeForgroundNotification() {
    console.log("Removing foreground notification");
    fse.ensureDir(iOS_DIR + "/Smartie/Plugins/cordova-plugin-firebase/", err => {
        if(!err) {
            if(utils.fileExists(iOS_DIR + "/Smartie/Plugins/cordova-plugin-firebase/AppDelegate+FirebasePlugin.m")) {
                var firebasDelegate = fse.readFileSync(iOS_DIR + "/Smartie/Plugins/cordova-plugin-firebase/AppDelegate+FirebasePlugin.m").toString();
                firebasDelegate = firebasDelegate.replace("completionHandler(UNNotificationPresentationOptionAlert);", "completionHandler(UNNotificationPresentationOptionNone);")
                fse.writeFileSync(iOS_DIR + "/Smartie/Plugins/cordova-plugin-firebase/AppDelegate+FirebasePlugin.m", firebasDelegate);
                console.log("@@ Forground notification removed @@");
            }
        }

    })
}