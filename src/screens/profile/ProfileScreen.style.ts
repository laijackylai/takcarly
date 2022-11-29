import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, Platform, StatusBar } from "react-native";
import { ScreenHeight } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  buttons: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    buttons: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      marginTop: 0.025 * ScreenHeight,
    },
  });
};
