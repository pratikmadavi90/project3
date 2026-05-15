import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API = "https://api.harzo.in/api/users";

export default function Profile() {

  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

 // 📥 Load user data
useEffect(() => {
  const loadData = async () => {
    try {
     

      // ✅ pehle local storage check karo
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Data load nahi hua");
    }
  };

  loadData();
}, []);

 

  // 💾 Update
  const updateProfile = async () => {
    try {
      if (!user.email) {
        Alert.alert("Error", "Email missing hai");
        return;
      }

      const res = await fetch(`${API}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      console.log("UPDATE RESPONSE:", data);

      console.log("USER DATA SEND:", user);
console.log("STATUS:", res.status);
      
    await AsyncStorage.setItem(
  "user",
  JSON.stringify(user)
);

      Alert.alert("Success", "Profile updated");

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Update failed");
    }
  };

  // 🔥 LOGOUT FUNCTION (FINAL FIXED)
  const handleLogout = async () => {
  try {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              // CLEAR STORAGE
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");

              // CLEAR UI
              setUser({
                name: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                pincode: "",
              });

              // GO HOME
              router.replace("/(tabs)");

            } catch (error) {
              console.log(
                "Logout Error:",
                error
              );
            }
          },
        },
      ]
    );
  } catch (err) {
    console.log(err);
  }
};
 

  return (
     <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
      >
        
      <Text style={styles.heading}>👤 Profile</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        value={user.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setUser({ ...user, phone: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={user.address}
        onChangeText={(text) => setUser({ ...user, address: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="City"
        value={user.city}
        onChangeText={(text) => setUser({ ...user, city: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Pincode"
        value={user.pincode}
        keyboardType="numeric"
        onChangeText={(text) => setUser({ ...user, pincode: text })}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={updateProfile}>
        <Text style={styles.btnText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
  style={styles.option}
  onPress={() => router.push("/orders")}
>
  <Text style={styles.optionText}>📦 My Orders</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>❤️ Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>💳 Payments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🔔 Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🛠 Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>ℹ️ About App</Text>
        </TouchableOpacity>

        {/* 🔥 LOGOUT */}
        <TouchableOpacity 
          style={[styles.option, { borderBottomWidth: 0 }]} 
          activeOpacity={0.7}
          onPress={() => {
            console.log("Logout pressed");
            handleLogout();
          }}
        >
          <Text style={[styles.optionText, { color: "red" }]}>
            🚪 Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  btn: {
    backgroundColor: "#0a8754",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },

  option: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});