import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
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
import CalendarStrip from "react-native-calendar-strip";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Moment } from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStore } from "aws-amplify";
import { ScheduledItem } from "models";
import ContentModal from "./ContentModal";
import axios from "axios";
import { useNotification } from "react-native-internal-notification";

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const noti = useNotification();
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [schedule, setSchedule] = useState<ScheduledItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().getFullYear().toString() +
    "-" +
    (new Date().getMonth() + 1).toString() +
    "-" +
    new Date().getDate().toString(),
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<string>("add");
  const [selectedItemID, setSelectedItemID] = useState<string | undefined>();

  const openUpdateModal = (id: string) => {
    setSelectedItemID(id);
    setEditType("edit");
    toggleModal();
  };

  const openAddModal = () => {
    setSelectedItemID(undefined);
    setEditType("add");
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dateSelect = (d: Moment) => {
    // eslint-disable-next-line prefer-destructuring
    const selectedDate = d.toDate().toISOString().split("T")[0];
    setSelectedDate(selectedDate);
  };

  const getData = async (selectedDate: string) => {
    const uid = await AsyncStorage.getItem("uid");
    if (uid == null) return;
    const scheduledItems = await DataStore.query(
      ScheduledItem,
      (item) => item.and((i) => [i.userID.eq(uid), i.date.eq(selectedDate)]),
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

  const sendRemindNotification = async (
    title: string,
    body: string,
    key: string,
    device: string,
  ) => {
    const lamdbaUrl =
      "https://qad2nhxgkfxgcd3priedbzgfae0pqubj.lambda-url.ap-southeast-1.on.aws/";
    const params = {
      title: title,
      body: body,
      key: key,
      device: device,
    };
    const res = await axios.get(lamdbaUrl, { params: params });
    if (res.status === 200) {
      noti.showNotification({
        title: localStrings.successSendNoti,
        icon: (
          <Icon
            name="hand-okay"
            type="MaterialCommunityIcons"
            color={colors.green}
            size={35}
          />
        ),
      });
    }
  };

  useEffect(() => {
    getData(selectedDate);
  }, [selectedDate, isModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text h1 bold color={colors.darkBlue}>
            {localStrings.calendar}
          </Text>
          <TouchableOpacity>
            <Icon name="search" size={35} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>
        <CalendarStrip
          selectedDate={new Date()}
          onDateSelected={dateSelect}
          scrollable
          style={styles.calendarStrip}
          calendarHeaderStyle={{ color: colors.darkBlue, fontSize: 20 }}
          dateNameStyle={{ color: colors.darkBlue, fontSize: 12.5 }}
          dateNumberStyle={{ color: colors.darkBlue, fontSize: 12.5 }}
          highlightDateContainerStyle={{ backgroundColor: colors.blueGreen }}
          highlightDateNameStyle={{ color: colors.lightBlue, fontSize: 12.5 }}
          highlightDateNumberStyle={{ color: colors.lightBlue, fontSize: 12.5 }}
        />
      </View>
      {/* react-native-just-timeline */}
      {schedule.length === 0 && (
        <View style={styles.noEvents}>
          <Text h2 bold color={colors.darkBlue}>
            {localStrings.noEvents}
          </Text>
        </View>
      )}
      {schedule.length > 0 && (
        <ScrollView style={styles.timelineContainer}>
          {schedule.map((s, i) => (
            <View key={i} style={styles.singleTimelineContainer}>
              <View style={styles.timelineTime}>
                <Text h4>{s.time}</Text>
              </View>
              <View style={[styles.timelineEvents, styles.flexRow]}>
                <TouchableOpacity
                  style={[styles.flexColumn, styles.itemTouch]}
                  onPress={() => openUpdateModal(s.id)}
                >
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
                </TouchableOpacity>
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
              <TouchableOpacity onPress={() => { }} style={styles.bell}>
                <Icon
                  name="bell"
                  type="MaterialCommunityIcons"
                  size={30}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.plusBtn}>
        <TouchableOpacity onPress={openAddModal}>
          <Icon name="plus" type="Entypo" size={125} color={colors.white} />
        </TouchableOpacity>
      </View>
      <ContentModal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        editType={editType}
        date={selectedDate}
        selectedItemID={selectedItemID}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
