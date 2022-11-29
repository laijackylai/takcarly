import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { ScreenHeight } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  btns: ViewStyle;
  link: ViewStyle;
  linkBtn: ViewStyle;
  codeInput: ViewStyle;
  linkedElderlies: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    btns: {
      marginTop: 0.025 * ScreenHeight,
      marginBottom: 0.1 * ScreenHeight,
      alignItems: "center",
    },
    link: {
      alignItems: "center",
      marginTop: 0.025 * ScreenHeight,
    },
    linkBtn: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.darkBlue,
    },
    codeInput: {
      fontSize: 20,
    },
    linkedElderlies: {
      alignItems: "center",
    },
  });
};
