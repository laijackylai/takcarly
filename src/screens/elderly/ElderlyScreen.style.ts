import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import { ExtendedTheme } from "@react-navigation/native";
import {
  ViewStyle,
  StyleSheet,
  Platform,
  StatusBar,
  TextStyle,
  ImageStyle,
} from "react-native";

interface Style {
  container: ViewStyle;
  titleTop: ViewStyle;
  calendarStrip: ViewStyle;
  titleTextStyle: TextStyle;
  buttonStyle: ViewStyle;
  buttonTextStyle: TextStyle;
  header: ViewStyle;
  contentContainer: ViewStyle;
  listContainer: ViewStyle;
  profilePicImageStyle: ImageStyle;
  plusBtn: ViewStyle;
  empty: ViewStyle;
  noEvents: ViewStyle;
  timelineContainer: ViewStyle;
  singleTimelineContainer: ViewStyle;
  timelineTime: ViewStyle;
  timelineEvents: ViewStyle;
  eventType: ViewStyle;
  alert: ViewStyle;
  title: ViewStyle;
  flexRow: ViewStyle;
  flexColumn: ViewStyle;
  itemTouch: ViewStyle;
  bell: ViewStyle;
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
    titleTop: {
      paddingTop: 5,
      paddingBottom: 15,
    },
    calendarStrip: {
      width: 0.9 * ScreenWidth,
      height: 75,
    },
    titleTextStyle: {
      fontSize: 32,
    },
    buttonStyle: {
      height: 45,
      width: ScreenWidth * 0.9,
      marginTop: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      shadowRadius: 5,
      shadowOpacity: 0.7,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },
    buttonTextStyle: {
      color: colors.white,
      fontWeight: "700",
    },
    header: {
      width: ScreenWidth * 0.9,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    contentContainer: {
      flex: 1,
      marginTop: 16,
    },
    listContainer: {
      marginTop: 8,
    },
    profilePicImageStyle: {
      height: 50,
      width: 50,
      borderRadius: 30,
    },
    plusBtn: {
      borderRadius: 1000,
      backgroundColor: colors.blueGreen,
      padding: 7.5,
      position: "absolute",
      right: -0.055 * ScreenWidth,
      bottom: -0.03 * ScreenHeight,
    },
    empty: {
      padding: 0.15 * ScreenWidth,
    },
    noEvents: {
      marginTop: 0.275 * ScreenHeight,
    },
    timelineContainer: {
      paddingTop: 0.025 * ScreenHeight,
      paddingHorizontal: 0.05 * ScreenWidth,
      flex: 1,
      flexDirection: "column",
    },
    singleTimelineContainer: {
      flex: 1,
      flexDirection: "row",
      width: 0.9 * ScreenWidth,
      paddingBottom: 0.025 * ScreenHeight,
    },
    timelineTime: {
      width: 0.2 * ScreenWidth,
    },
    timelineEvents: {
      width: 0.7 * ScreenWidth,
      backgroundColor: colors.white,
      borderLeftWidth: 10,
      borderLeftColor: colors.darkBlue,
      borderRadius: 10,
      shadowColor: "#171717",
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      padding: 0.025 * ScreenWidth,
      justifyContent: "space-between",
    },
    eventType: {
      position: "absolute",
      right: 0.01 * ScreenWidth,
      top: 0.01 * ScreenWidth,
    },
    alert: {
      alignSelf: "center",
    },
    title: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    flexRow: {
      flex: 1,
      flexDirection: "row",
    },
    flexColumn: {
      flex: 1,
      flexDirection: "column",
    },
    itemTouch: {
      maxWidth: 0.5 * ScreenWidth,
    },
    bell: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 10,
    },
  });
};
