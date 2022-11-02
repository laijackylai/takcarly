import "react-native-gesture-handler";
import "@azure/core-asynciterator-polyfill";
import React, { useEffect } from "react";
import { StatusBar, useColorScheme, LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Amplify from "aws-amplify";
import awsExports from "./src/aws-exports";

LogBox.ignoreAllLogs();

Amplify.configure(awsExports);

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [scheme, isDarkMode]);

  const storeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // error reading value, add new default value
        storeData("user", "null");
      }
    };

    getData();
  }, []);

  return (
    <>
      <Navigation />
    </>
  );
};

export default App;
