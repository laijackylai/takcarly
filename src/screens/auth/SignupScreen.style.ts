import { ViewStyle, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  textInput: ViewStyle;
  btn: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: colors.background,
    },
    textInput: {
      alignItems: "center",
      height: 0.15 * ScreenWidth,
      justifyContent: "space-between",
    },
    btn: {
      padding: 10,
      backgroundColor: colors.darkBlue,
      borderRadius: 10,
    },
  });
};
