import Text from "@shared-components/text-wrapper/TextWrapper";
import React, { useMemo, useState } from "react";
import { SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import createStyles from "./LoginScreen.style";
import { Auth } from "aws-amplify";
import { localStrings } from "shared/localization";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface LoginScreenProps { }

const LoginScreen: React.FC<LoginScreenProps> = () => {
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

  const navToSignup = () => {
    NavigationService.push(SCREENS.SIGNUP);
  };

  const navToElderly = () => {
    NavigationService.push(SCREENS.ELDERLYLINK);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 bold color={colors.darkBlue} style={styles.loginText}>
        {localStrings.login}
      </Text>
      <View style={styles.textInput}>
        <TextInput
          placeholder={localStrings.username}
          textContentType="name"
          autoCapitalize="none"
          onChangeText={(t) => setUsername(t)}
          style={styles.input}
        />
        <TextInput
          placeholder={localStrings.password}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(t) => setPw(t)}
          style={styles.input}
        />
      </View>
      <View style={styles.btns}>
        <TouchableOpacity onPress={login}>
          <Text h3 bold color={colors.darkBlue}>
            {localStrings.login}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navToElderly} style={styles.elderlyBtn}>
          <Text h3 bold color={colors.white}>
            {localStrings.elderly}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={navToSignup} style={styles.signupBtn}>
        <Text h4>{localStrings.signup}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;
