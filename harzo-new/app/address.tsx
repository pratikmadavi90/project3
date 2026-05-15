import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function Address() {

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  // ✅ SAVE ADDRESS
  const saveAddress = async () => {

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {

      Alert.alert(
        "Missing Fields",
        "Please fill all details"
      );

      return;
    }

    if (phone.length < 10) {

      Alert.alert(
        "Invalid Phone",
        "Enter valid phone number"
      );

      return;
    }

    try {

      const userData = {

        name,
        phone,
        address,
        city,
        pincode,
      };

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      Alert.alert(
        "Success",
        "Address Saved"
      );

      // ✅ GO PAYMENT
      router.push("/payment");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong"
      );
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>
          Delivery Address
        </Text>

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          placeholder="Enter full name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          placeholder="Enter phone number"
          style={styles.input}
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>
          Full Address
        </Text>

        <TextInput
          placeholder="House no, street, area"
          style={[
            styles.input,
            styles.addressInput,
          ]}
          multiline
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>
          City
        </Text>

        <TextInput
          placeholder="Enter city"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>
          Pincode
        </Text>

        <TextInput
          placeholder="Enter pincode"
          style={styles.input}
          keyboardType="number-pad"
          value={pincode}
          onChangeText={setPincode}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={saveAddress}
        >

          <Text style={styles.btnText}>
            Continue To Payment
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#111",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  input: {
    backgroundColor: "#fff",

    borderRadius: 14,

    paddingHorizontal: 15,
    paddingVertical: 15,

    marginBottom: 18,

    fontSize: 15,

    borderWidth: 1,
    borderColor: "#eee",

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,

    elevation: 2,
  },

  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#facc15",

    paddingVertical: 17,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 10,

    marginBottom: 30,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

});