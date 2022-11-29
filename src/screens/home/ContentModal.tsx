/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ContentModal.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { localStrings } from "shared/localization";
import Modal from "react-native-modal";
import Icon from "react-native-dynamic-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStore } from "aws-amplify";
import { ScheduledItem } from "models";
import DatePicker from "react-native-date-picker";
import { useNotification } from 'react-native-internal-notification';

interface ContentModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  editType: string;
  date: string;
  selectedItemID?: string;
}

const ContentModal: React.FC<ContentModalProps> = ({
  isVisible,
  onBackdropPress,
  editType,
  date,
  selectedItemID,
}) => {
  const noti = useNotification();
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [icon, setIcon] = useState<string>("white-balance-sunny");
  const [starred, setStarred] = useState<boolean>(false);
  const [chooseIconModalVisibility, setChooseIconModalVisibility] =
    useState<boolean>(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [datePicked, setDatePicked] = useState<Date>(new Date());
  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false);
  const [timePicked, setTimePicked] = useState<Date>(new Date());
  const [confirmDeleteModalVisibility, setConfirmDeleteModalVisibility] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ScheduledItem>();

  const handleSchedule = () => {
    if (editType === "add") addSchedule();
    if (editType === "edit") updateSchedule();
  };

  const addSchedule = async () => {
    if (title.length === 0 || description.length === 0) return;
    const uid = await AsyncStorage.getItem("uid");
    if (!uid) {
      console.info("UID not found");
      return;
    }
    await DataStore.save(
      new ScheduledItem({
        title: title,
        description: description,
        type: icon,
        completed: false,
        starred: starred,
        userID: uid,
        date: date,
        time: dateToTimeString(),
      }),
    )
      .catch((e) => console.error(e))
      .then(() => {
        noti.showNotification({
          title: localStrings.successAddSchedule,
          icon: (
            <Icon
              name="hand-okay"
              type="MaterialCommunityIcons"
              color={colors.green}
              size={35}
            />
          ),
        });
        onBackdropPress();
      });
  };

  const updateSchedule = async () => {
    if (!selectedItem) return;
    if (title.length === 0 || description.length === 0) return;
    const uid = await AsyncStorage.getItem("uid");
    if (!uid) {
      console.info("UID not found");
      return;
    }
    await DataStore.save(
      ScheduledItem.copyOf(selectedItem, (u) => {
        u.title = title;
        u.description = description;
        u.type = icon;
        u.starred = starred;
        u.date = dateToString(datePicked);
        u.time = dateToTimeString();
      }),
    )
      .then(() => {
        noti.showNotification({
          title: localStrings.successUpdateSchedule,
          icon: (
            <Icon
              name="hand-okay"
              type="MaterialCommunityIcons"
              color={colors.green}
              size={35}
            />
          ),
        });
        onBackdropPress();
      })
      .catch((e) => console.error(e));
  };

  const deleteSchedule = async () => {
    if (!selectedItemID) return;
    const itemToBeDeleted = await DataStore.query(
      ScheduledItem,
      selectedItemID,
    );
    if (!itemToBeDeleted) return;
    await DataStore.delete(itemToBeDeleted)
      .catch((e) => console.error(e))
      .then(() => {
        noti.showNotification({
          title: localStrings.successDeleteSchedule,
          icon: (
            <Icon
              name="hand-okay"
              type="MaterialCommunityIcons"
              color={colors.green}
              size={35}
            />
          ),
        });
        setConfirmDeleteModalVisibility(false);
        onBackdropPress();
      });
  };

  const iconsList = [
    { id: 1, name: "white-balance-sunny" },
    { id: 2, name: "pill" },
    { id: 3, name: "silverware-fork-knife" },
    { id: 4, name: "alarm" },
    { id: 5, name: "dumbbell" },
    { id: 6, name: "weather-night" },
    { id: 7, name: "doctor" },
  ];

  const IndiIcon = ({ item }: { item: { id: number; name: string } }) => {
    return (
      <TouchableOpacity
        style={styles.iconItem}
        onPress={() => selectIcon(item.name)}
      >
        <Icon
          name={item.name}
          type="MaterialCommunityIcons"
          size={50}
          color={item.name === icon ? colors.blue : colors.darkBlue}
        />
      </TouchableOpacity>
    );
  };

  const selectIcon = (name: string) => {
    setIcon(name);
    setChooseIconModalVisibility(false);
  };

  const translateDate = useCallback(() => {
    const dateObj = new Date(Date.parse(date));
    return dateObj;
  }, [date]);

  const dateToString = (d: Date) => {
    const dateString =
      d.getFullYear().toString() +
      "-" +
      (d.getMonth() + 1).toString() +
      "-" +
      d.getDate().toString();
    return dateString;
  };

  const dateToTimeString = () => {
    let hourString;
    let minuteString;

    const hour = timePicked.getHours();
    const minute = timePicked.getMinutes();

    if (hour < 10) {
      hourString = "0" + hour.toString();
    } else {
      hourString = hour.toString();
    }
    if (minute < 10) {
      minuteString = "0" + minute.toString();
    } else {
      minuteString = minute.toString();
    }
    return hourString + ":" + minuteString;
  };

  const onEditModal = useCallback(async () => {
    if (!selectedItemID) return;
    const data = await DataStore.query(
      ScheduledItem,
      (i) => i.id.eq(selectedItemID),
      { limit: 1 },
    ).catch((e) => console.error(e));

    try {
      if (data && data[0]) {
        setTitle(data[0].title);
        setDescription(data[0].description);

        const [hour, minute] = data[0].time.split(":");
        const time = new Date();
        time.setHours(parseInt(hour), parseInt(minute), 0, 0);
        setTimePicked(time);

        setIcon(data[0].type);
        setStarred(data[0].starred);

        setSelectedItem(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedItemID]);

  const onNewModal = useCallback(() => {
    if (selectedItemID) return;
    setTitle("");
    setDescription("");
    setDatePicked(new Date());
    setTimePicked(new Date());
    setIcon("white-balance-sunny");
    setStarred(false);
  }, [selectedItemID]);

  useEffect(() => {
    const dateToBeSet = translateDate();
    setDatePicked(dateToBeSet);
    onEditModal();
    onNewModal();
  }, [translateDate, onEditModal, onNewModal]);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <Text h1 bold color={colors.darkBlue} style={styles.newItemTitle} >
          {editType === "add" && localStrings.newSchedule}
          {editType === "edit" && localStrings.editSchedule}
        </Text>
        <View>
          <Text h3 color={colors.darkBlue}>
            {localStrings.title}
          </Text>
          <TextInput
            value={title}
            placeholder={localStrings.inputTitle}
            style={styles.titleInput}
            multiline={true}
            onChangeText={(t) => setTitle(t)}
          />
        </View>
        <View>
          <Text h3 color={colors.darkBlue}>
            {localStrings.description}
          </Text>
          <TextInput
            value={description}
            placeholder={localStrings.inputDescription}
            style={styles.descriptionInput}
            multiline={true}
            onChangeText={(d) => setDescription(d)}
          />
        </View>
        <View style={styles.otherDeets}>
          <View style={styles.flexRow}>
            <Text h3 color={colors.darkBlue}>
              {localStrings.type}
            </Text>
            <TouchableOpacity
              onPress={() => setChooseIconModalVisibility((ov) => !ov)}
            >
              <Icon
                name={icon}
                type="MaterialCommunityIcons"
                size={25}
                color={colors.blue}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow}>
            <Text h3 color={colors.darkBlue}>
              {localStrings.dateSelect}
            </Text>
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <Text h4>{dateToString(datePicked)}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={datePickerOpen}
              date={datePicked}
              onConfirm={(d) => {
                setDatePickerOpen(false);
                setDatePicked(d);
              }}
              onCancel={() => setDatePickerOpen(false)}
              androidVariant="iosClone"
              textColor={colors.darkBlue}
            />
          </View>
          <View style={styles.flexRow}>
            <Text h3 color={colors.darkBlue}>
              {localStrings.timeSelect}
            </Text>
            <TouchableOpacity onPress={() => setTimePickerOpen(true)}>
              <Text h4>{dateToTimeString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="time"
              open={timePickerOpen}
              date={timePicked}
              onConfirm={(t) => {
                setTimePickerOpen(false);
                setTimePicked(t);
              }}
              onCancel={() => setTimePickerOpen(false)}
              androidVariant="iosClone"
              textColor={colors.darkBlue}
            />
          </View>
          <View style={styles.flexRow}>
            <Text h3 color={colors.darkBlue}>
              {localStrings.starred}
            </Text>
            <Switch
              trackColor={{ false: colors.darkBlue, true: colors.blue }}
              thumbColor={starred ? colors.white : colors.white}
              ios_backgroundColor={colors.darkBlue}
              onValueChange={() => setStarred((os) => !os)}
              value={starred}
              style={styles.switch}
            />
          </View>
        </View>
        <View style={styles.btns}>
          <View style={styles.btn}>
            <TouchableOpacity onPress={handleSchedule}>
              <Text h3 bold color={colors.white}>
                {editType === "add" && localStrings.add}
                {editType === "edit" && localStrings.edit}
              </Text>
            </TouchableOpacity>
          </View>
          {editType === "edit" && (
            <View style={styles.delBtn}>
              <TouchableOpacity
                onPress={() => setConfirmDeleteModalVisibility(true)}
              >
                <Text h3 bold color={colors.white}>
                  {localStrings.delete}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Modal
        isVisible={chooseIconModalVisibility}
        onBackdropPress={() => setChooseIconModalVisibility((ov) => !ov)}
      >
        <View style={styles.iconContainer}>
          <Text h2 bold color={colors.darkBlue} style={styles.typeTitle}>
            {localStrings.chooseIcon}
          </Text>
          <FlatList
            style={styles.icons}
            data={iconsList}
            numColumns={3}
            renderItem={IndiIcon}
          />
        </View>
      </Modal>
      <Modal
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={100}
        animationOutTiming={100}
        isVisible={confirmDeleteModalVisibility}
        onBackdropPress={() => setConfirmDeleteModalVisibility((ov) => !ov)}
      >
        <View style={styles.delContainer}>
          <Text h2 color={colors.darkBlue}>
            {localStrings.deleteConfirmation}
          </Text>
          <View style={styles.btns}>
            <View style={styles.btn}>
              <TouchableOpacity
                onPress={() => setConfirmDeleteModalVisibility(false)}
              >
                <Text h3 bold color={colors.white}>
                  {localStrings.cancel}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.delBtn}>
              <TouchableOpacity onPress={deleteSchedule}>
                <Text h3 bold color={colors.white}>
                  {localStrings.delete}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ContentModal;
