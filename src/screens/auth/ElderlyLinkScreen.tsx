import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform, SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * ? Local Imports
 */
import createStyles from "./ElderlyLinkScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { DataStore } from "aws-amplify";
import { Elderly, User } from "models";
import { localStrings } from "shared/localization";
import * as NavigationService from "react-navigation-helpers";

interface ElderlyLinkScreenProps {}

const ElderlyLinkScreen: React.FC<ElderlyLinkScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [linkCode, setLinkCode] = useState<string>("");
  const [linked, setLinked] = useState<boolean>(false);

  const getData = async (): Promise<void> => {
    const code = await AsyncStorage.getItem("elderlyCode");
    if (code) setLinkCode(JSON.parse(code));
    else {
      const newCode = makeID(6);
      await storeData("elderlyCode", newCode);
      setLinkCode(newCode);
      // save new code into aws amplify
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Token not found");
        return;
      }
      await DataStore.save(
        new Elderly({
          code: newCode,
          key: token,
          device: Platform.OS,
          linked: false,
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
      DataStore.observeQuery(Elderly, (e) =>
        e.code.eq(JSON.parse(code)),
      ).subscribe(async (snapshot) => {
        const { items, isSynced } = snapshot;
        if (items && items.length > 0) {
          const [elderly] = items;
          if (elderly.linked) setLinked(true);
          const linkedUser = await DataStore.query(
            User,
            (u) => u.userElderlyId.eq(elderly.id),
            { limit: 1 },
          );
          if (linkedUser.length > 0) {
            setLinked(true);
            NavigationService.navigate("ElderlyScreen", {
              uid: linkedUser[0].id,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    // _clearCode();
    getData();
    // * stupid but it works method
    checkLinked();
    const checkLinkedInterval = setInterval(() => {
      checkLinked();
    }, 5000);
    if (linked) {
      clearInterval(checkLinkedInterval);
    }
  }, [linked]);

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
