import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "models";

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  await AsyncStorage.setItem("uid", user.id);
  console.info("saved user");
};
