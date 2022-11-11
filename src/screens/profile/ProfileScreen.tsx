import React, { useMemo } from "react";
import { Button, SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { Auth } from "aws-amplify";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "../../shared/constants/index";
import { removeUser } from "shared/functions/removeUser";
import { localStrings } from "shared/localization";

interface ProfileScreenProps { }

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const signout = async () => {
    try {
      await Auth.signOut({ global: true });
      removeUser();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const link = () => {
    NavigationService.push(SCREENS.CARETAKERLINK);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        {localStrings.profile}
      </Text>
      <View>
        <Button title={localStrings.link} onPress={link} />
        <Button title={localStrings.signout} onPress={signout} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
