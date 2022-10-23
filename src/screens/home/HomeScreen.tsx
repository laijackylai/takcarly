import React, { useMemo } from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
/**
 * ? Shared Imports
 */
import Text from "@shared-components/text-wrapper/TextWrapper";

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.text}>
        Home
      </Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
