import React, { useEffect, useMemo, useState } from "react";
import { Button, SafeAreaView, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ElderlyLinkScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import * as NavigationService from "react-navigation-helpers";
import { addLinkedElderly } from "shared/functions/updateUser";
import { getUser } from "../../shared/functions/getUser";
import { User } from "models";

interface CaretakerLinkScreenProps { }

const CaretakerLinkScreen: React.FC<CaretakerLinkScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [linkCode, setLinkCode] = useState<string>("");
  const [linkedElderly, setLinkedElderly] = useState<Array<string | null>>([]);

  const link = () => {
    addLinkedElderly(linkCode);
  };

  const linkLater = () => {
    NavigationService.goBack();
  };

  useEffect(() => {
    const run = async () => {
      const user: User = await getUser();
      if (user == null || user == undefined) return;
      const elderlies = user.linkedElderly;
      if (elderlies == null) return;
      setLinkedElderly(elderlies);
    };
    run();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        Please fill in Link Code
      </Text>
      <View style={styles.gap} />
      <TextInput
        placeholder="Code"
        textContentType="oneTimeCode"
        autoCapitalize="characters"
        onChangeText={(t) => setLinkCode(t)}
      />
      <View style={styles.gap} />
      <View>
        <Button title="link" onPress={link} />
        <Button title="link later" onPress={linkLater} />
      </View>
      <View style={styles.gap} />
      <View style={{ alignItems: "center" }}>
        <Text h3 color={colors.text}>
          Linked Elderly
        </Text>
        <View>
          {linkedElderly.map((s, i) => (
            <Text h5 color={colors.text} key={i}>
              {s}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CaretakerLinkScreen;
