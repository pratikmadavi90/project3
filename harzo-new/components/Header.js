import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function Header() {

  const [deliveryTime, setDeliveryTime] = useState("One Day Delivery");

  useEffect(() => {

    const loadDeliveryTime = async () => {

      const data = await AsyncStorage.getItem("deliverySettings");

      if (data) {
        const settings = JSON.parse(data);
        setDeliveryTime(settings.deliveryTime || "One Day Delivery");
      }

    };

    loadDeliveryTime();

  }, []);

  // 🔍 SEARCH OPEN
  const openSearch = () => {
    router.push("/search");
  };

  return (
    <View style={styles.header}>

      {/* TOP ROW */}
      <View style={styles.topRow}>

<Text style={styles.time}>
  ⚡ {deliveryTime} Minute Delivery
</Text>
      </View>

      {/* LOCATION */}
      <Text style={styles.location}>
        MH34 Maharashtra
      </Text>

      <Text style={styles.subText}>
        Sarswathi
      </Text>

      {/* SEARCH */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={openSearch}
      >

        <View style={styles.searchRow}>

          <TextInput
            placeholder="Search"
            placeholderTextColor="#666666"
            style={styles.input}
            editable={false}
            pointerEvents="none"
          />

          <Text style={styles.icon}>
            📝
          </Text>

        </View>
<Text style={styles.storeTiming}>
  ⚠️ Demo Version – Testing Purpose Only
</Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

 header: {
  backgroundColor: "#facc15",

  paddingTop: 70,
  paddingBottom: 20,
  paddingHorizontal: 18,

  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,

  marginBottom: 18,

  minHeight: 250,
},

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ✅ TEXT FIX
  time: {
    fontSize: 16,

    fontWeight:
      Platform.OS === "android"
        ? "700"
        : "bold",

    color: "#111111",

    includeFontPadding: false,
  },

  profile: {
    backgroundColor: "#fff",

    width: 38,
    height: 38,

    borderRadius: 50,

    justifyContent: "center",
    alignItems: "center",
  },

  // ✅ LOCATION FIX
  location: {
    marginTop: 10,

    color: "#111111",

    fontWeight:
      Platform.OS === "android"
        ? "700"
        : "bold",

    fontSize: 15,

    includeFontPadding: false,
  },

  // ✅ SUBTEXT FIX
  subText: {
    fontSize: 15,

    color: "#111111",

    marginTop: 2,

    fontWeight: "650",

    includeFontPadding: false,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 18,

    backgroundColor: "#ffffff",

    borderRadius: 14,

    paddingHorizontal: 14,

    height: 54,

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  // ✅ SEARCH TEXT FIX FOR ALL PHONES
  input: {
    flex: 1,

    fontSize: 15,

    color: "#111111",

    fontWeight: "500",

    includeFontPadding: false,

    paddingVertical:
      Platform.OS === "android"
        ? 8
        : 10,

    textAlignVertical: "center",
  },

  // ✅ ICON FIX
  icon: {
    marginLeft: 10,

    fontSize: 16,

    includeFontPadding: false,
  },

storeTiming: {
  marginTop: 15,     
  fontSize: 15,
  fontWeight: "600",
  color: "#111",
},

});