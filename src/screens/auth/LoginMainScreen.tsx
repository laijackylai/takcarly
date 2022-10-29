import React, { useMemo } from "react";
import { Button, SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./LoginMainScreen.style";
/**
 * ? Shared Imports
 */
import Text from "@shared-components/text-wrapper/TextWrapper";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface LoginScreenProps { }

const LoginMainScreen: React.FC<LoginScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const signup = (): void => {
    NavigationService.push(SCREENS.LOGINSIGNUP, { type: "signup" });
  };

  const login = (): void => {
    NavigationService.push(SCREENS.LOGINSIGNUP, { type: "login" });
  };

  const elderly = (): void => {
    NavigationService.push(SCREENS.ELDERLYLINK);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text h1 color={colors.text}>
          Takcarly
        </Text>
      </View>
      <View>
        <Button title="Login" onPress={login} />
        <Button title="Sign Up" onPress={signup} />
        <Button title="Elderly" onPress={elderly} />
      </View>
    </SafeAreaView>
  );
};

export default LoginMainScreen;
