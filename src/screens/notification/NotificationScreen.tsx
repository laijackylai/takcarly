import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./NotificationScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { localStrings } from "shared/localization";

interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 bold color={colors.text}>
        {localStrings.notifications}
      </Text>
      <Text h5>{localStrings.noNotifications}</Text>
    </SafeAreaView>
  );
};

export default ProfileScreen;
