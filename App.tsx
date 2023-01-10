import "react-native-gesture-handler";
import "@azure/core-asynciterator-polyfill";
import React, { useEffect } from "react";
import { StatusBar, useColorScheme, LogBox, Platform } from "react-native";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
import { NotificationProvider } from "react-native-internal-notification";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs();

PushNotification.configure({
  onRegister: async (token) => {
    console.info("TOKEN:", token);
    if (token) await AsyncStorage.setItem("token", token.token);
  },

  // Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.info("NOTIFICATION:", notification);
    // process the notification
    // PushNotification.localNotification(notification);
    // eslint-disable-next-line import/no-named-as-default-member
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
  }, [scheme, isDarkMode]);

  const configureAWS = async () => {
    await Amplify.configure(awsExports);
    return true;
  };

  useEffect(() => {
    configureAWS();
  }, []);

  return (
    <NotificationProvider>
      <Navigation />
    </NotificationProvider>
  );
};

export default App;
