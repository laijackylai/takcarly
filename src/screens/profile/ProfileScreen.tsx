import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
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
import { TouchableOpacity } from "react-native-gesture-handler";

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
      <Text h1 bold color={colors.text}>
        {localStrings.profile}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={link}>
          <Text h3 color={colors.darkBlue}>
            {localStrings.link}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signout}>
          <Text h3 color={colors.danger}>
            {localStrings.signout}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
