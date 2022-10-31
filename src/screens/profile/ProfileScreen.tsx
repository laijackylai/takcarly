import React, { useMemo } from "react";
import { Button, View } from "react-native";
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
    <View style={styles.container}>
      <Text h1 color={colors.text}>
        Profile
      </Text>
      <Button title="Link" onPress={link} />
      <Button title="Sign Out" onPress={signout} />
    </View>
  );
};

export default ProfileScreen;
