import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user);
};
