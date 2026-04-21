import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>

      {/* TOP ROW */}
      <View style={styles.topRow}>
        <Text style={styles.time}>⚡ one day delivery</Text>

        <View style={styles.profile}>
          <Text>👤</Text>
        </View>
      </View>

      {/* LOCATION */}
      <Text style={styles.location}>
  MH34 Maharashtra
</Text>

<Text style={styles.subText}>
  Sarswathi
</Text>

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search for 'paneer'"
          style={styles.input}
        />

        <Text style={styles.icon}>🎤</Text>
        <Text style={styles.icon}>📝</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
header: {
  backgroundColor: "#facc15",
  paddingVertical: 40,   // 👈 upar niche bada
  paddingHorizontal: 18, 
  borderRadius: 18,      // 👈 thoda smooth
  marginBottom: 15,
},

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  time: {
    fontSize: 18,
    fontWeight: "bold",
  },

  profile: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
  },

  location: {
    marginTop: 5,
    color: "#333",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    padding: 8,
  },

  icon: {
    marginLeft: 10,
    fontSize: 16,
  },

  subText: {
  fontSize: 13,
  color: "#333",
  marginTop: 2,
  fontWeight: "500",
},

});