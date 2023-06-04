import Text from "@shared-components/text-wrapper/TextWrapper";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import createStyles from "./SignupScreen.style";
import { Auth, DataStore } from "aws-amplify";
import { User } from "models";
import { localStrings } from "shared/localization";

interface SignupScreenProps { }

const SignupScreen: React.FC<SignupScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [username, setUsername] = useState<string>();
  const [pw, setPw] = useState<string>();

  /**
   * Sign up a user with the given username and password.
   * @param {string} username - the username to sign up with.
   * @param {string} pw - the password to sign up with.
   * @returns None
   */
  const signup = async (): Promise<any> => {
    try {
      if (username === undefined || pw === undefined) return;
      await Auth.signUp({
        username,
        password: pw,
        attributes: {
          email: `${username}@gmail.com`,
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
        .catch((e) => Alert.alert(`Sign up Error: ${e}`));
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  /**
   * Creates a new user in the database.
   * @param {string} name - the name of the user to create
   * @returns None
   */
  const createNewUser = async (name: string) => {
    await DataStore.save(
      new User({
        name,
      }),
    )
      .then((user) => console.info(`new user created: ${user.name}`))
      .catch((e) => console.error(e));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 bold color={colors.text}>
        {localStrings.signup}
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
      <TouchableOpacity onPress={signup} style={styles.btn}>
        <Text h2 bold color={colors.white}>
          {localStrings.signup}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignupScreen;
