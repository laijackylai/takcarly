import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Icon from "react-native-dynamic-vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "@shared-constants";
import { LightTheme, DarkTheme, palette } from "@theme/themes";
// ? Screens
import HomeScreen from "@screens/home/HomeScreen";
import ProfileScreen from "@screens/profile/ProfileScreen";
import NotificationScreen from "@screens/notification/NotificationScreen";
import DetailScreen from "@screens/detail/DetailScreen";
import LoginMainScreen from "@screens/auth/LoginMainScreen";
import LoginSignupScreen from "@screens/auth/LoginSignupScreen";
import { Hub } from "aws-amplify";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RenderHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
      <Stack.Screen name={SCREENS.DETAIL}>
        {(props) => <DetailScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [signedIn, setSignedIn] = useState<boolean>(false);

  Hub.listen("auth", (data) => {
    const { payload } = data;
    const { event } = payload;
    console.log(event);
    switch (event) {
      case "autoSignIn": {
        const user = payload.data;
        console.log(user);
        setSignedIn(true);
        break;
      }
      case "autoSignIn_failure":
        break;
      case "signIn": {
        const user = payload.data;
        console.log(user);
        setSignedIn(true);
        break;
      }
      default:
        console.log(event);
        break;
    }
  });

  useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = "home";
    switch (route.name) {
      case SCREENS.HOME:
        iconName = focused ? "home" : "home-outline";
        break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "notifications" : "notifications-outline";
        break;
      case SCREENS.PROFILE:
        iconName = focused ? "person" : "person-outline";
        break;
      default:
        iconName = focused ? "home" : "home-outline";
        break;
    }
    return <Icon name={iconName} type="Ionicons" size={size} color={color} />;
  };

  const renderLoginStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.LOGINMAIN} component={LoginMainScreen} />
        <Stack.Screen
          name={SCREENS.LOGINSIGNUP}
          component={LoginSignupScreen}
          initialParams={{ type: "login" }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      {!signedIn && renderLoginStack()}

      {signedIn && (
        <Tab.Navigator
          initialRouteName={SCREENS.HOME}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) =>
              renderTabIcon(route, focused, color, size),
            tabBarActiveTintColor: palette.primary,
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: isDarkMode ? palette.black : palette.white,
            },
          })}
        >
          <Tab.Screen
            name={SCREENS.NOTIFICATION}
            component={NotificationScreen}
          />
          <Tab.Screen name={SCREENS.HOME} component={RenderHomeStack} />
          <Tab.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
