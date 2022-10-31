import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user: any) => {
  const currentUser = await AsyncStorage.getItem("user");
  if (currentUser === null) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
};
