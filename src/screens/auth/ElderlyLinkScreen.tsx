import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
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

interface ElderlyLinkScreenProps { }

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
      await DataStore.save(
        new Elderly({
          code: linkCode,
          userID: "null",
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

  };

  useEffect(() => {
    // _clearCode();
    getData();
    checkLinked();
  }, []);

  useEffect(() => {
    // nav to elderly screen
    if (linked) {
      console.log("linked");
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
