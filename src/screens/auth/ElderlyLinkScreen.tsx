import React, { useEffect, useMemo, useState } from "react";
import { Platform, SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * ? Local Imports
 */
import createStyles from "./ElderlyLinkScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { DataStore } from "aws-amplify";
import { Elderly } from "models";
import { localStrings } from "shared/localization";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface ElderlyLinkScreenProps { }

const ElderlyLinkScreen: React.FC<ElderlyLinkScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [linkCode, setLinkCode] = useState<string>("");

  const getData = async (): Promise<void> => {
    const code = await AsyncStorage.getItem("elderlyCode");
    if (code) setLinkCode(JSON.parse(code));
    else {
      const newCode = makeID(6);
      await storeData("elderlyCode", newCode);
      setLinkCode(newCode);
      // save new code into aws amplify
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await DataStore.save(
        new Elderly({
          code: newCode,
          userID: "null",
          key: token,
          device: Platform.OS,
        }),
      )
        .catch((e) => console.error(e))
        .then(() => {
          console.info("saved new elderly code", newCode);
        });
    }
  };

  const storeData = async (key: string, value: string): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const makeID = (length: number): string => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const _clearCode = (): void => {
    AsyncStorage.removeItem("elderlyCode");
  };

  const checkLinked = async (): Promise<void> => {
    const code = await AsyncStorage.getItem("elderlyCode");
    if (code) {
      const users = await DataStore.query(
        Elderly,
        (e) => e.code.eq(JSON.parse(code)),
        { limit: 1 },
      ).catch((e) => console.error(e));
      if (users && users.length > 0) {
        const linkedUser = users[0].userID;
        if (linkedUser) {
          console.log(linkedUser);
          NavigationService.navigate(SCREENS.ELDERLYSCREEN, {
            uid: linkedUser,
          });
        }
      }
    }
  };

  useEffect(() => {
    // _clearCode();
    getData();
    checkLinked();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 bold color={colors.darkBlue}>
        {localStrings.elderlyLinkCode}
      </Text>
      <View style={styles.gap} />
      <Text h1 color={colors.text}>
        {linkCode}
      </Text>
    </SafeAreaView>
  );
};

export default ElderlyLinkScreen;
