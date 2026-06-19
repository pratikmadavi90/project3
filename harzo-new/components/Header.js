import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

import { router } from "expo-router";
import { Image } from "react-native";

export default function Header() {

  // 🔍 SEARCH OPEN
  const openSearch = () => {
    router.push("/search");
  };

  return (
    <View style={styles.header}>

      {/* TOP ROW */}
     <View style={styles.topRow}>
  <Text style={styles.time}>
    ⚡ 20 Minute delivery
  </Text>

  <TouchableOpacity style={styles.profile}>
    <Image
      source={require("../assets/images/shrike-logo.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  </TouchableOpacity>
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

      </TouchableOpacity>

       <Text style={styles.storeTime}>
  ⏰ Store Timeng: 5:00 AM - 12:00 AM
</Text>

    </View>
  );
}

const styles = StyleSheet.create({

  header: {
    backgroundColor: "#facc15",

    paddingVertical: 40,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    marginBottom: 10,

    minHeight: 260,
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
  width: 70,
  height: 70,
  borderRadius: 40,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

logo: {
  width: 50,
  height: 50,
},

  // ✅ LOCATION FIX
  location: {
    marginTop: 0,

    color: "#111111",

    fontWeight:
      Platform.OS === "android"
        ? "700"
        : "bold",

    fontSize: 20,

    includeFontPadding: false,
  },

  // ✅ SUBTEXT FIX
  subText: {
    fontSize: 16,

    color: "#111111",

    marginTop: 3,

    fontWeight: "500",

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

  storeTime: {
  fontSize: 13,
  color: "#333",
  marginTop: 25,
  marginLeft: 5,
  fontWeight: "600",
},

});