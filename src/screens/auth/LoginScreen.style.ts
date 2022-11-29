import { ViewStyle, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { ScreenWidth, ScreenHeight } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  textInput: ViewStyle;
  input: ViewStyle;
  btns: ViewStyle;
  elderlyBtn: ViewStyle;
  signupBtn: ViewStyle;
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
      width: ScreenWidth,
      height: 0.15 * ScreenWidth,
      justifyContent: "space-between",
    },
    input: {
      fontSize: 20,
    },
    btns: {
      justifyContent: "center",
      alignItems: "center",
    },
    elderlyBtn: {
      marginTop: 0.01 * ScreenHeight,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: colors.darkBlue,
    },
    signupBtn: {
      borderBottomColor: colors.text,
      borderBottomWidth: 1,
    },
  });
};
