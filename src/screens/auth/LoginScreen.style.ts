import { ViewStyle, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { ScreenWidth, ScreenHeight } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  loginText: ViewStyle;
  textInput: ViewStyle;
  input: ViewStyle;
  btns: ViewStyle;
  elderlyBtn: ViewStyle;
  signupBtn: ViewStyle;
  backgroundImg: ViewStyle;
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
    loginText: {},
    textInput: {
      alignItems: "center",
      width: ScreenWidth,
      height: 0.15 * ScreenWidth,
      justifyContent: "space-between",
    },
    input: {
      fontSize: 20,
      alignItems: "center",
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
    backgroundImg: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: ScreenWidth,
      height: ScreenHeight,
      position: "absolute",
    },
  });
};
