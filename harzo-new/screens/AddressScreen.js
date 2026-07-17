import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from "expo-location";

export default function AddressScreen() {

  const [user, setUser] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // AUTO LOAD PROFILE
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {

    try {

      const savedUser =
      await AsyncStorage.getItem("user");

      if (savedUser) {

        const parsedUser =
        JSON.parse(savedUser);

        if (
          parsedUser.name &&
          parsedUser.phone &&
          parsedUser.address &&
          parsedUser.city &&
          parsedUser.pincode
        ) {

          router.replace("/payment");

          return;
        }

        setUser(parsedUser);
      }

    } catch (error) {
      console.log(error);
    }

  };



  const placeOrder = async () => {

    try {

      // CHECK EMPTY FIELDS
      if (
        !user.name ||
        !user.phone ||
        !user.address ||
        !user.city ||
        !user.pincode
      ) {

        Alert.alert(
          "Error",
          "Please fill all fields"
        );

        return;
      }


      // LOCATION PERMISSION
      const { status } =
      await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {

        Alert.alert(
          "Permission Denied",
          "Location permission required"
        );

        return;
      }


      // GET CURRENT LOCATION
      const currentLocation =
      await Location.getCurrentPositionAsync({});

      const latitude =
      currentLocation.coords.latitude;

      const longitude =
      currentLocation.coords.longitude;


      // CONVERT GPS TO ADDRESS
      const addressData =
      await Location.reverseGeocodeAsync({

        latitude,
        longitude,

      });

 const liveArea =
addressData[0]?.subregion ||
addressData[0]?.district ||
addressData[0]?.city ||
addressData[0]?.name ||
"";

const livePincode =
addressData[0]?.postalCode || "";

console.log(
"Live Area:",
liveArea
);

console.log(
"Live Pincode:",
livePincode
); 

      // GET ADMIN DELIVERY AREAS
      const response =
   await fetch("https://api.harzo.in/api/delivery/all")

     const areasResponse =
await response.json();

const areas =
areasResponse.data || areasResponse;


 // MATCH AREA (pehle name se)
let matchedArea = areas.find((item) =>
  liveArea
    .toLowerCase()
    .includes((item.name || "").toLowerCase().trim())
);

// Agar name se nahi mila to pincode se
if (!matchedArea) {
  matchedArea = areas.find(
    (item) =>
      (item.pincode || "").toString().trim() ===
      livePincode.toString().trim()
  );
}


      // DELIVERY NOT AVAILABLE
      if (!matchedArea) {

        Alert.alert(
          "Delivery Not Available",
          "Sorry, we do not deliver in your area"
        );

        return;
      }


      // SAVE USER
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      

      // SAVE DELIVERY SETTINGS
await AsyncStorage.setItem(
  "deliverySettings",
  JSON.stringify({
    deliveryCharge: matchedArea.charge,
    deliveryTime: matchedArea.time,
    freeDeliveryAbove: matchedArea.freeDeliveryAbove,
    minimumOrder: matchedArea.minimumOrder,
    landmark: matchedArea.landmark,
    address: matchedArea.address,
  })
);


      // GO PAYMENT
      router.push("/payment");

    }

    catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong"
      );

    }

  };



  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Delivery Address
      </Text>


      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={(text) =>
          setUser({
            ...user,
            name: text
          })
        }
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        value={user.phone}
        onChangeText={(text) =>
          setUser({
            ...user,
            phone: text
          })
        }
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={user.address}
        onChangeText={(text) =>
          setUser({
            ...user,
            address: text
          })
        }
        style={styles.input}
      />

      <TextInput
        placeholder="City"
        value={user.city}
        onChangeText={(text) =>
          setUser({
            ...user,
            city: text
          })
        }
        style={styles.input}
      />

      <TextInput
        placeholder="Pincode"
        value={user.pincode}
        onChangeText={(text) =>
          setUser({
            ...user,
            pincode: text
          })
        }
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={placeOrder}
      >

        <Text style={styles.buttonText}>
          Place Order
        </Text>

      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#facc15",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },

});