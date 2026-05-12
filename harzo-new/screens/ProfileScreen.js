import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // ✅ Load saved data on app open
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem("userProfile");
      if (data !== null) {
        const parsed = JSON.parse(data);
        setName(parsed.name || "");
        setPhone(parsed.phone || "");
        setEmail(parsed.email || "");
        setAddress(parsed.address || "");
      }
    } catch (error) {
      console.log("Load Error:", error);
    }
  };

  // ✅ Save data
  const handleSave = async () => {
    try {
      const profileData = { name, phone, email, address };
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
      alert("Profile Saved Successfully ✅");
    } catch (error) {
      console.log("Save Error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.heading}>My Profile</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Full Address"
        style={[styles.input, { height: 100 }]}
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.btnText}>Save Profile</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});