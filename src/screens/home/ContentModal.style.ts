import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  newItemTitle: ViewStyle;
  titleInput: ViewStyle;
  descriptionInput: ViewStyle;
  btn: ViewStyle;
  flexRow: ViewStyle;
  flexColumn: ViewStyle;
  iconContainer: ViewStyle;
  icons: ViewStyle;
  iconItem: ViewStyle;
  btns: ViewStyle;
  delBtn: ViewStyle;
  typeTitle: ViewStyle;
  delContainer: ViewStyle;
  otherDeets: ViewStyle;
  switch: ViewStyle;
  inputShadow: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingHorizontal: 0.05 * ScreenWidth,
      // paddingVertical: 0.02 * ScreenHeight,
      flex: 1,
      // justifyContent: "space-between",
      marginVertical: 0.16 * ScreenHeight,
    },
    inputShadow: {
      shadowRadius: 5,
      shadowOpacity: 0.25,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 3,
        height: 5,
      },
      backgroundColor: "white",
    },
    titleInput: {
      paddingVertical: 20,
      paddingHorizontal: 10,
      marginTop: 5,
      marginBottom: 10,
      borderLeftWidth: 10,
      borderRadius: 10,
      borderBottomRightRadius: 10,
      borderColor: colors.darkBlue,
      fontSize: 17,
      // fontWeight: "bold",
    },
    newItemTitle: {
      paddingVertical: 15,
    },
    descriptionInput: {
      paddingVertical: 20,
      paddingHorizontal: 10,
      marginTop: 5,
      marginBottom: 10,
      borderLeftWidth: 10,
      borderRadius: 10,
      borderBottomRightRadius: 10,
      borderColor: colors.darkBlue,
      height: 0.15 * ScreenHeight,
    },
    btn: {
      backgroundColor: colors.darkBlue,
      padding: 10,
      borderRadius: 15,
      marginTop: 15,
      alignSelf: "center",
    },
    delBtn: {
      backgroundColor: colors.danger,
      padding: 10,
      borderRadius: 15,
      marginTop: 15,
      alignSelf: "center",
    },
    flexRow: {
      // flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    flexColumn: {
      flex: 1,
      flexDirection: "column",
    },
    iconContainer: {
      backgroundColor: colors.background,
      height: 0.5 * ScreenHeight,
      marginVertical: 0.25 * ScreenHeight,
      marginHorizontal: 0.05 * ScreenWidth,
      borderRadius: 20,
      padding: 0.05 * ScreenWidth,
      justifyContent: "space-between",
    },
    delContainer: {
      height: 0.175 * ScreenHeight,
      backgroundColor: colors.background,
      marginHorizontal: 0.05 * ScreenWidth,
      borderRadius: 20,
      padding: 0.05 * ScreenWidth,
    },
    icons: {
      flex: 3,
      marginHorizontal: "auto",
    },
    iconItem: {
      flex: 1,
      maxWidth: "33%",
      alignItems: "center",
      padding: 10,
      marginTop: 10,
    },
    btns: {
      flex: 1,
      flexDirection: "row-reverse",
      alignSelf: "flex-end",
      minWidth: 0.3 * ScreenWidth,
      justifyContent: "space-between",
      paddingBottom: 15,
    },
    typeTitle: {
      paddingHorizontal: 0.025 * ScreenWidth,
    },
    otherDeets: {
      marginTop: 15,
    },
    switch: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
  });
};
