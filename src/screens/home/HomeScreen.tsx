import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
/**
 * ? Shared Imports
 */
import Text from "@shared-components/text-wrapper/TextWrapper";
import { localStrings } from "shared/localization";
import Icon from "react-native-dynamic-vector-icons";

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text h1 bold color={colors.text}>
          {localStrings.calendar}
        </Text>
        <Icon name="search" size={35} color="#000" />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
