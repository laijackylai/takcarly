import React, { useMemo, useState } from "react";
import { Button, SafeAreaView, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ElderlyLinkScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import * as NavigationService from "react-navigation-helpers";

interface CaretakerLinkScreenProps { }

const CaretakerLinkScreen: React.FC<CaretakerLinkScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [linkedCode, setLinkedCode] = useState<string>("");

  const link = () => {
    console.log(link);
  };

  const linkLater = () => {
    NavigationService.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        Please fill in Link Code
      </Text>
      <TextInput
        placeholder="Code"
        textContentType="oneTimeCode"
        autoCapitalize="characters"
        onChangeText={(t) => setLinkedCode(t)}
      />
      <View>
        <Button title="link" onPress={link} />
        <Button title="link later" onPress={linkLater} />
      </View>
    </SafeAreaView>
  );
};

export default CaretakerLinkScreen;
