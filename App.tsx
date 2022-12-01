import "react-native-gesture-handler";
import "@azure/core-asynciterator-polyfill";
import React, { useEffect } from "react";
import { StatusBar, useColorScheme, LogBox } from "react-native";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
import { NotificationProvider } from "react-native-internal-notification";

LogBox.ignoreAllLogs();

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
