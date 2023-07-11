import React, { useMemo, useState } from "react";
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
import { localStrings } from "shared/localization";
import { TouchableOpacity } from "react-native-gesture-handler";
import DeleteModal from "components/DeleteModal";
import { removeUser } from "shared/functions/removeUser";

interface ProfileScreenProps { }

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const signout = async () => {
    try {
      await Auth.signOut({ global: true });
      removeUser();
    } catch (error) {
      console.error("error signing out: ", error);
    }
  };

  const deleteUser = async () => {
    try {
      await Auth.deleteUser();
      removeUser();
    } catch (error) {
      console.error("Error deleting user", error);
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
        <TouchableOpacity onPress={link} style={styles.button}>
          <Text h3 color={colors.darkBlue}>
            {localStrings.link}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signout} style={styles.button}>
          <Text h3 color={colors.danger}>
            {localStrings.signout}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteModalVisible(true)}
          style={styles.button}
        >
          <Text h3 color={colors.danger}>
            {localStrings.removeUser}
          </Text>
        </TouchableOpacity>
      </View>
      <DeleteModal
        isVisible={deleteModalVisible}
        setVisibility={setDeleteModalVisible}
        onDelete={deleteUser}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
