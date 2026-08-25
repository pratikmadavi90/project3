import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator

  size="large"
  color="#0C8A7B"
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    bottom: -150,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999,
    elevation: 999999,
  },
});