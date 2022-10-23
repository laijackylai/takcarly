import Text from "@shared-components/text-wrapper/TextWrapper";
import React, { useMemo, useState } from "react";
import { Button, SafeAreaView, TextInput, View } from "react-native";
import { RouteProp, useTheme } from "@react-navigation/native";

import createStyles from "./LoginSignupScreen.style";
import { Auth } from "aws-amplify";

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
      });
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        {type === "login" ? "Login" : "Signup"}
      </Text>
      <View style={styles.textInput}>
        <TextInput
          placeholder="username"
          textContentType="name"
          autoCapitalize="none"
          onChangeText={(t) => setUsername(t)}
        />
        <TextInput
          placeholder="password"
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(t) => setPw(t)}
        />
      </View>
      {type === "login" ? (
        <Button title="login" onPress={login} />
      ) : (
        <Button title="signup" onPress={signup} />
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
