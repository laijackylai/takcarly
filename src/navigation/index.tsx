import React, { useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";
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
import LoginScreen from "@screens/auth/LoginScreen";
import { Analytics, DataStore, Hub } from "aws-amplify";
import ElderlyLinkScreen from "@screens/auth/ElderlyLinkScreen";
import CaretakerLinkScreen from "@screens/auth/CaretakerLinkScreen";
import * as NavigationService from "react-navigation-helpers";
import { User } from "models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUser } from "shared/functions/saveUser";
import SignupScreen from "@screens/auth/SignupScreen";
import { PushNotification } from "@aws-amplify/pushnotification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Notifications } from "react-native-notifications";
import SplashScreen from "react-native-splash-screen";
import ElderlyScreen from "@screens/elderly/ElderlyScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RenderHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREENS.HOMEMAIN} component={HomeScreen} />
      <Stack.Screen name={SCREENS.DETAIL}>
        {(props) => <DetailScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const RenderProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.PROFILEMAIN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={SCREENS.PROFILEMAIN} component={ProfileScreen} />
      <Stack.Screen
        name={SCREENS.CARETAKERLINK}
        component={CaretakerLinkScreen}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [elderlyLinked, setElderlyLinked] = useState<boolean>(false);

  Hub.listen("auth", (data) => {
    const { payload } = data;
    const { event } = payload;
    switch (event) {
      case "autoSignIn": {
        const user = payload.data;
        if (user) signInFlow(user);
        break;
      }
      case "autoSignIn_failure":
        break;
      case "signIn": {
        const user = payload.data;
        if (user) signInFlow(user);
        break;
      }
      case "signOut":
        setSignedIn(false);
        break;
      default:
        break;
    }
  });

  const signInFlow = async (user: any) => {
    const name: string = user.username;
    if (name) {
      const userData = await DataStore.query(User, (u) => u.name.eq(name), {
        limit: 1,
      });
      if (userData && userData[0]) {
        console.info("user data: ", userData[0]);
        checkLinkedElderly(userData[0]);
        saveUser(userData[0]);
        subscribeToUser(userData[0].id);
        setSignedIn(true);
      }

      // aws analytics
      Analytics.autoTrack("session", {
        enable: true,
        attributes: {
          name: name,
        },
      });
      console.info("aws analytics setup");
    }
  };

  const subscribeToUser = (id: string) => {
    const subscription = DataStore.observe(User, id).subscribe(
      async (newUserData) => {
        await AsyncStorage.setItem("user", JSON.stringify(newUserData.element));
      },
    );
    console.info("subscribed to user changes, subscription ID: ", subscription);
  };

  const checkLinkedElderly = async (userData: User) => {
    const { userElderlyId } = userData;
    if (userElderlyId) {
      setElderlyLinked(true);
      NavigationService.navigate(SCREENS.HOME);
    } else {
      console.info("no elderly linked");
      setElderlyLinked(false);
      NavigationService.navigate(SCREENS.PROFILE, {
        screen: SCREENS.CARETAKERLINK,
      });
    }
  };

  const _clearAsyncStorage = async () => {
    await AsyncStorage.clear();
  };

  const configureNotifications = async () => {
    console.info("[notification] configuring...");
    if (Platform.OS === "ios") {
      PushNotification.requestIOSPermissions();
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannel({
        channelId: "takcarly",
        name: "Takcarly",
        importance: 5,
        description: "Takcarly notification channel",
        enableLights: true,
        enableVibration: true,
        // groupId: 'my-group', // optional
        // groupName: 'My Group', // optional, will be presented in Android OS notification permission
        showBadge: true,
        // soundFile: 'custom_sound.mp3',  // place this in <project_root>/android/app/src/main/res/raw/custom_sound.mp3
        vibrationPattern: [200, 1000, 500, 1000, 500],
      });
    }

    PushNotification.onNotification((notification: any) => {
      console.info("[notification] notification received: ", notification);

      if (Platform.OS === "ios") {
        // eslint-disable-next-line import/no-named-as-default-member
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
      if (Platform.OS === "android") {
        if (notification.title && notification.body) {
          Notifications.postLocalNotification({
            title: notification.title,
            body: notification.body,
            identifier: "",
            payload: undefined,
            sound: "",
            badge: 0,
            type: "",
            thread: "",
          });
        }
      }
    });

    PushNotification.onRegister(async (token: any) => {
      console.info(`[notification] ${Platform.OS} app device token: `, token);
      if (token) await AsyncStorage.setItem("token", token);
    });

    PushNotification.onNotificationOpened((notification: any) => {
      console.info("[notification] the notification is opened: ", notification);
    });
    return true;
  };

  const storeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    const handleUser = async () => {
      // _clearAsyncStorage();
      const currentUser = await AsyncStorage.getItem("user");
      const uid = await AsyncStorage.getItem("uid");
      if (currentUser != null && uid != null) {
        setSignedIn(true);
        subscribeToUser(uid);
        checkLinkedElderly(JSON.parse(currentUser));
      }
      return true;
    };
    const getData = async () => {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue === null) storeData("user", "null");
      return true;
    };
    const run = async () => {
      const bool1 = await getData();
      const bool2 = await handleUser();
      const bool3 = await configureNotifications();
      if (bool1 && bool2 && bool3) {
        SplashScreen.hide();
      }
    };
    run();
  }, []);

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
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREENS.SIGNUP} component={SignupScreen} />
        <Stack.Screen
          name={SCREENS.ELDERLYLINK}
          component={ElderlyLinkScreen}
        />
        <Stack.Screen name={SCREENS.ELDERLYSCREEN} component={ElderlyScreen} />
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
          initialRouteName={elderlyLinked ? SCREENS.HOME : SCREENS.PROFILE}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) =>
              renderTabIcon(route, focused, color, size),
            tabBarActiveTintColor: palette.darkBlue,
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
          <Tab.Screen name={SCREENS.PROFILE} component={RenderProfileStack} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
