import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ElderlyScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScheduledItem } from "models";
import { DataStore } from "aws-amplify";
import Icon from "react-native-dynamic-vector-icons";
import { localStrings } from "shared/localization";

interface ElderlyScreenProps {
  route: any;
}

const ElderlyScreen: React.FC<ElderlyScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { uid } = route.params;

  const [schedule, setSchedule] = useState<ScheduledItem[]>([]);

  const dateToString = (d: Date) => {
    let monthStr;
    let dayStr;

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const yearStr = year.toString();
    if (month < 10) {
      monthStr = "0" + month.toString();
    } else {
      monthStr = month.toString();
    }
    if (day < 10) {
      dayStr = "0" + day.toString();
    } else {
      dayStr = day.toString();
    }

    const datetimeStr = yearStr + "-" + monthStr + "-" + dayStr;
    return datetimeStr;
  };

  const getData = async () => {
    const date = dateToString(new Date());
    if (uid == null) return;
    const scheduledItems = await DataStore.query(
      ScheduledItem,
      (item) => item.and((i) => [i.userID.eq(uid), i.date.eq(date)]),
      {
        sort: (i) => i.time("ASCENDING"),
      },
    );
    if (scheduledItems.length > 0) {
      setSchedule(scheduledItems);
    } else {
      setSchedule([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleTop}>
        <Text h1 bold color={colors.text}>
          {localStrings.elderlyScreen}
        </Text>
      </View>
      <ScrollView>
        {schedule.map((s, i) => (
          <View key={i} style={styles.singleTimelineContainer}>
            <View style={styles.timelineTime}>
              <Text h4>{s.time}</Text>
            </View>
            <View style={[styles.timelineEvents, styles.flexRow]}>
              <View style={[styles.flexColumn, styles.itemTouch]}>
                <View style={styles.title}>
                  <Icon
                    name={s.type}
                    type="MaterialCommunityIcons"
                    size={20}
                    color={colors.text}
                  />
                  <Text h3 bold color={colors.text}>
                    {s.title}
                  </Text>
                </View>
                <Text>{s.description}</Text>
              </View>
              {s.starred && (
                <View style={styles.alert}>
                  <Icon
                    name="star-four-points"
                    type="MaterialCommunityIcons"
                    size={35}
                    color={colors.bell}
                  />
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ElderlyScreen;
