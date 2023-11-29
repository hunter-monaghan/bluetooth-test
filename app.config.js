const appPackage = require("./package.json");
const AndroidVersion = require("./AndroidVersion.json");
const APP_VARIANT = process.env.APP_VARIANT ?? "developement";

const name = {
  production: "BlueTooth-Test",
  preprod: "BlueTooth-Test",
  preview: "BlueTooth-Test",
  staging: "BlueTooth-Test",
  development: "BlueTooth-Test", //`ManagerGenie (dev-${hostName}-${userName})`,
};

const privacy = {
  production: "public",
  preprod: "hidden",
  preview: "hidden",
  staging: "hidden",
  development: "hidden",
};

const bundleIdentifier = {
  production: "com.hunter.monaghan.bluetoothtest",
  preprod: "com.hunter.monaghan.bluetoothtest",
  preview: "com.hunter.monaghan.bluetoothtest",
  development: "com.hunter.monaghan.bluetoothtest",
};

export default {
  expo: {
    owner: "hunter.monaghan", //TODO: Change to ManagerGenie Creds
    name: name[APP_VARIANT],
    privacy: privacy[APP_VARIANT],
    orientation: "portrait",
    description: "Bluetooth testing app",
    slug: `bluetooth-test`, //TODO: Change to ManagerGenie Creds
    scheme: "bluetooth-test",
    version: appPackage.version,
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    notification: {
      iosDisplayInForeground: true,
    },
    androidStatusBar: {
      translucent: false,
      backgroundColor: "#0059D4",
    },
    jsEngine: "hermes",
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            buildToolsVersion: "33.0.0",
          },
          ios: {
            deploymentTarget: "13.0",
            useFrameworks: "static",
          },
        },
      ],
    ],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleIdentifier[APP_VARIANT],
      buildNumber: appPackage.version,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: bundleIdentifier[APP_VARIANT],
      versionCode: AndroidVersion.version,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "88e30c00-f356-495a-952b-ab9132224c0d", //TODO: Change to ManagerGenie Creds
      },
    },
    updates: {
      enable: true,
      fallbackToCacheTimeout: 5000,
      url: "https://u.expo.dev/88e30c00-f356-495a-952b-ab9132224c0d", //TODO: Change to MangerGenie Creds
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
