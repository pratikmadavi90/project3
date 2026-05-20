import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function App() {

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.box}>

        <Text style={styles.title}>
          HARZO STAFF
        </Text>

        <Text style={styles.subtitle}>
          Warehouse App Running
        </Text>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

});