import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./CaretakerLinkScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import * as NavigationService from "react-navigation-helpers";
import { Elderly, User } from "models";
import { localStrings } from "shared/localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStore } from "aws-amplify";
import { useNotification } from "react-native-internal-notification";
import Icon from "react-native-dynamic-vector-icons";
import { getUser } from "shared/functions/getUser";

interface CaretakerLinkScreenProps { }

const CaretakerLinkScreen: React.FC<CaretakerLinkScreenProps> = () => {
  const noti = useNotification();
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [linkCode, setLinkCode] = useState<string>("");
  const [linkedElderly, setLinkedElderly] = useState<string>();

  const link = async () => {
    const uid = await AsyncStorage.getItem("uid");
    if (!uid) return;
    const elderlyToBeLinked = await DataStore.query(
      Elderly,
      (e) => e.code.eq(linkCode),
      { limit: 1 },
    );
    if (elderlyToBeLinked.length > 0) {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) return;
      const user = await DataStore.query(User, uid);
      if (!user) return;
      await DataStore.save(
        User.copyOf(user, (u) => {
          u.userElderlyId = elderlyToBeLinked[0].id;
        }),
      )
        .catch((e) => console.error(e))
        .then(() => {
          checkLinkedElderlies();
          noti.showNotification({
            title: localStrings.successLinkElderly,
            icon: (
              <Icon
                name="hand-heart"
                type="MaterialCommunityIcons"
                color={colors.green}
                size={35}
              />
            ),
          });
          linkLater();
        });
      await DataStore.save(
        Elderly.copyOf(elderlyToBeLinked[0], (e) => {
          e.linked = true;
        }),
      );
    }
  };

  const linkLater = () => {
    NavigationService.goBack();
  };

  const checkLinkedElderlies = async () => {
    const user = await getUser();
    if (!user) return;
    const elderlyId = user.userElderlyId;
    const linkedEldery = await DataStore.query(Elderly, elderlyId);
    setLinkedElderly(linkedEldery?.code);
  };

  useEffect(() => {
    checkLinkedElderlies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        {localStrings.fillInLinkCode}
      </Text>
      <View style={styles.link}>
        <TextInput
          placeholder={localStrings.code}
          textContentType="oneTimeCode"
          autoCapitalize="characters"
          onChangeText={(t) => setLinkCode(t)}
          style={styles.codeInput}
        />
        <View style={styles.btns}>
          <TouchableOpacity onPress={link} style={styles.linkBtn}>
            <Text h3 bold color={colors.white}>
              {localStrings.link}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={linkLater}>
            <Text h3 color={colors.darkBlue}>
              {localStrings.linkLater}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {linkedElderly && linkedElderly.length > 0 && (
          <View style={styles.linkedElderlies}>
            <Text h3 color={colors.text}>
              {localStrings.linkedElderly}
            </Text>
            <Text h5 color={colors.text}>
              {linkedElderly}
            </Text>
          </View>
        )}
        {linkedElderly && linkedElderly.length === 0 && (
          <View>
            <Text h3 color={colors.darkBlue}>
              {localStrings.noLinkedElderly}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CaretakerLinkScreen;
