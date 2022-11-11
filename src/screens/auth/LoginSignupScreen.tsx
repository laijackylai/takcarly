import Text from "@shared-components/text-wrapper/TextWrapper";
import React, { useMemo, useState } from "react";
import { Alert, Button, SafeAreaView, TextInput, View } from "react-native";
import { RouteProp, useTheme } from "@react-navigation/native";

import createStyles from "./LoginSignupScreen.style";
import { Auth, DataStore } from "aws-amplify";
import { User } from "models";
import { localStrings } from "shared/localization";

type LoginSignupScreenParams = {
  LoginSignup: { type: string };
};

interface LoginScreenProps {
  route: RouteProp<LoginSignupScreenParams, "LoginSignup">;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ route }) => {
  const { type } = route.params;
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [username, setUsername] = useState<string>();
  const [pw, setPw] = useState<string>();

  const login = async (): Promise<any> => {
    if (username === undefined || pw === undefined) return;
    try {
      await Auth.signIn(username, pw);
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  const signup = async (): Promise<any> => {
    try {
      if (username === undefined || pw === undefined) return;
      await Auth.signUp({
        username,
        password: pw,
        attributes: {
          // eslint-disable-next-line camelcase
          preferred_username: username,
        },
        autoSignIn: {
          enabled: true,
        },
      })
        .then((res) => {
          if (res.userConfirmed) {
            createNewUser(res.user.getUsername());
          }
        })
        .catch((e) => Alert.alert("Error", e));
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  const createNewUser = async (name: string) => {
    await DataStore.save(
      new User({
        name,
        linkedElderly: [],
        schedule: [],
      }),
    )
      .then((user) => console.info(`new user created: ${user.name}`))
      .catch((e) => console.error(e));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        {type === "login" ? localStrings.login : localStrings.signup}
      </Text>
      <View style={styles.textInput}>
        <TextInput
          placeholder={localStrings.username}
          textContentType="name"
          autoCapitalize="none"
          onChangeText={(t) => setUsername(t)}
        />
        <TextInput
          placeholder={localStrings.password}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(t) => setPw(t)}
        />
      </View>
      {type === "login" ? (
        <Button title={localStrings.login} onPress={login} />
      ) : (
        <Button title={localStrings.signup} onPress={signup} />
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
