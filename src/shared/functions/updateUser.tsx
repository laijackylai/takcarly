import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStore } from "aws-amplify";
import { User } from "models";
import { saveUser } from "./saveUser";
import * as NavigationService from "react-navigation-helpers";

export const addLinkedElderly = async (newElderly: string) => {
  try {
    const uid = await AsyncStorage.getItem("uid");
    if (uid === null) return;
    const original = await DataStore.query(User, uid);
    if (original === undefined) return;
    if (original.linkedElderly?.includes(newElderly)) {
      NavigationService.goBack();
      return;
    }
    await DataStore.save(
      User.copyOf(original, (updated) => {
        updated.linkedElderly = [...(original.linkedElderly || []), newElderly];
      }),
    ).then((newUser) => {
      saveUser(newUser);
      NavigationService.goBack();
    });
  } catch (error) {
    console.error(error);
  }
};
