import { Alert, Linking } from "react-native";

const API =
  "https://api.harzo.in/api/support-settings";

export const showSupportCallOptions = async () => {
  try {
    const res = await fetch(API);
    const data = await res.json();

console.log("API DATA =", data);

    const settings = Array.isArray(data)
      ? data[0]
      : data;

console.log("SETTINGS =", settings);
console.log("NUMBER1 =", settings.callNumber1);
console.log("NUMBER2 =", settings.callNumber2);      

    if (!settings) {
      Alert.alert(
        "Support",
        "Support number not available"
      );
      return;
    }

    const number1 = settings.callNumber1;
    const number2 = settings.callNumber2;

    const buttons = [];

if (number2) {
  buttons.push({
    text: `👟 Footwear - ${number2}`,
    onPress: () =>
      Linking.openURL(`tel:${number2}`),
  });
}

if (number1) {
  buttons.push({
    text: `🛒 Grocery - ${number1}`,
    onPress: () =>
      Linking.openURL(`tel:${number1}`),
  });
}



    buttons.push({
      text: "Cancel",
      style: "cancel",
    });

    Alert.alert(
      "Call Support",
      "Choose a number",
      buttons
    );
  } catch (err) {
    console.log(err);

    Alert.alert(
      "Error",
      "Unable to load support numbers"
    );
  }
};