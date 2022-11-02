import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  await AsyncStorage.setItem("uid", user.id);
};
