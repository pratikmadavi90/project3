import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const API = "https://api.harzo.in/api/users";

export default function Profile() {

  const router = useRouter();

  const [user, setUser] = useState({
    userId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Korpana",
    pincode: "",
  });

  // 📥 LOAD USER DATA
  useEffect(() => {

    const loadData = async () => {

      try {

        const savedUser =
          await AsyncStorage.getItem(
            "user"
          );

        if (savedUser) {

          const parsedUser =
            JSON.parse(savedUser);

          setUser({
            ...parsedUser,
            city: "Korpana",
          });
        }

      } catch (err) {

        console.log(err);

        Alert.alert(
          "Error",
          "Data load nahi hua"
        );
      }
    };

    loadData();

  }, []);

  // 💾 UPDATE PROFILE
  const updateProfile = async () => {

    try {

      // ✅ ADDRESS VALIDATION
      if (
        user.address.trim().length < 8
      ) {

        Alert.alert(
          "Invalid Address",
          "Please enter full delivery address"
        );

        return;
      }
// LOCATION PERMISSION
const { status } =
await Location.requestForegroundPermissionsAsync();

if(status !== "granted"){

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
longitude
});

const liveVillage =
addressData[0]?.name ||
addressData[0]?.street ||
addressData[0]?.district ||
addressData[0]?.subregion ||
addressData[0]?.city ||
"";

console.log(
"FULL LOCATION:",
addressData[0]
);

console.log(
"LIVE VILLAGE:",
liveVillage
);

const livePincode =
addressData[0]?.postalCode || "";


// GET DELIVERY AREAS
const response =
await fetch(
"https://api.harzo.in/api/delivery/all"
);

const areas =
await response.json();

const matchedArea =
(areas.data || areas).find(
(item)=>{

const village =
(item.area || "")
.toLowerCase()
.trim();

const userVillage =
user.address
.toLowerCase()
.trim();

const userPin =
user.pincode
.toString()
.trim();

return (
userVillage.includes(village)
&&
item.pincode
?.toString()
.trim() === userPin
);

}
);

if(!matchedArea){

Alert.alert(
"Delivery Not Available",
`No delivery in ${user.address}`
);

return;
}

      // ✅ EMAIL CHECK
      if (!user.email) {

        Alert.alert(
          "Error",
          "Email missing hai"
        );

        return;
      }

      // ✅ FINAL USER DATA
     const finalUser = {
  ...user,

  userId:
    user?.userId ||
    "USR" + Date.now(),

  city: "Korpana",
};

      // ✅ UPDATE API
      const res = await fetch(
        `${API}/update`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            finalUser
          ),
        }
      );

      const data =
        await res.json();

      console.log(
        "UPDATE RESPONSE:",
        data
      );

      console.log(
        "USER DATA SEND:",
        finalUser
      );

      console.log(
        "STATUS:",
        res.status
      );

      // ✅ SAVE LOCAL
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(finalUser)
      );

      // ✅ UPDATE UI
      setUser(finalUser);

      Alert.alert(
        "Success",
        "Profile updated"
      );

    } catch (err) {

      console.log(err);

      Alert.alert(
        "Error",
        "Update failed"
      );
    }
  };

  // 🔥 LOGOUT
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

                await AsyncStorage.removeItem(
                  "token"
                );

                await AsyncStorage.removeItem(
                  "user"
                );

            setUser({
             userId: "",
             name: "",
             phone: "",
             email: "",
             address: "",
             city: "Korpana",
             pincode: "",
             });

              router.replace("/");

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
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.profileHeader}>

        <View style={styles.profileCircle}>
          <Text style={styles.profileLetter}>
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "H"}
          </Text>
        </View>

        <Text style={styles.profileTitle}>
          Profile
        </Text>

        <Text style={styles.profileSubtitle}>
          Profile + Delivery Address
        </Text>

      </View>

      {/* NAME */}
      <TextInput
        placeholder="Name"
        placeholderTextColor="#666"
        value={user.name}
        autoCapitalize="words"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            name: text,
          })
        }
        style={styles.input}
      />

      {/* PHONE */}
      <TextInput
        placeholder="Phone"
        placeholderTextColor="#666"
        value={user.phone}
        keyboardType="phone-pad"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            phone: text,
          })
        }
        style={styles.input}
      />

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={user.email}
        autoCapitalize="none"
        keyboardType="email-address"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            email: text,
          })
        }
        style={styles.input}
      />

      {/* ADDRESS */}
      <TextInput
        placeholder="Village Name, House No, Landmark"
        placeholderTextColor="#666"
        value={user.address}
        multiline
        numberOfLines={3}
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            address: text,
          })
        }
        style={styles.addressInput}
      />

      {/* FIXED CITY */}
      <TextInput
        value="Korpana"
        editable={false}
        style={[
          styles.input,
          {
            backgroundColor:
              "#eee",

            color: "#444",
          },
        ]}
      />

      {/* PINCODE */}
      <TextInput
        placeholder="Pincode"
        placeholderTextColor="#666"
        value={user.pincode}
        keyboardType="numeric"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            pincode: text,
          })
        }
        style={styles.input}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.8}
        onPress={updateProfile}
      >
        <Text style={styles.btnText}>
          Save Profile
        </Text>
      </TouchableOpacity>

      {/* ACCOUNT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() =>
            router.push("/orders")
          }
        >
          <Text style={styles.optionText}>
            📦 My Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            💳 Payments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            🔔 Notifications
          </Text>
        </TouchableOpacity>

      </View>

      {/* SUPPORT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            🛠️ Help & Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            ℹ️ About App
          </Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[
            styles.option,
            {
              borderBottomWidth: 0,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => {

            console.log(
              "Logout pressed"
            );

            handleLogout();
          }}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: "red",
              },
            ]}
          >
            🚪 Logout
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },

  profileCircle: {
    width: 90,
    height: 90,

    borderRadius: 50,

    backgroundColor: "#22c55e",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // ✅ TEXT FIX FOR ALL DEVICES
  profileLetter: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    includeFontPadding: false,
    textAlign: "center",
  },

  profileTitle: {
    fontSize: 28,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    color: "#111827",
    includeFontPadding: false,
  },

  profileSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
    includeFontPadding: false,
  },

  // ✅ MAIN TEXT FIX
  input: {
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android"
      ? 12
      : 14,

    marginBottom: 14,

    fontSize: 16,

    color: "#111111",

    fontWeight: "500",

    includeFontPadding: false,

    textAlignVertical: "center",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // ✅ ADDRESS TEXT FIX
  addressInput: {
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingTop: 16,

    minHeight: 90,

    marginBottom: 14,

    fontSize: 16,

    color: "#111111",

    fontWeight: "500",

    includeFontPadding: false,

    textAlignVertical: "top",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  btn: {
    backgroundColor: "#22c55e",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 8,
    marginBottom: 22,

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  btnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    includeFontPadding: false,
  },

  section: {
    marginTop: 10,
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 17,
    color: "#64748b",
    marginBottom: 14,
    fontWeight: "700",
    marginLeft: 4,
    includeFontPadding: false,
  },

  option: {
    backgroundColor: "#ffffff",

    paddingVertical: 18,
    paddingHorizontal: 18,

    borderRadius: 18,

    marginBottom: 12,

    elevation: 2,

    borderWidth: 1,
    borderColor: "#f1f5f9",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  // ✅ OPTION TEXT FIX
  optionText: {
    fontSize: 17,
    fontWeight: Platform.OS === "android"
      ? "600"
      : "600",
    color: "#111827",
    includeFontPadding: false,
  },

});