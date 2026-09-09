import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>HARZO</Text>
        <Text style={styles.tagline}>1 Day Delivery</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Enter your mobile number to continue
        </Text>

        <TextInput
          placeholder="Enter Mobile Number"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00C853",
    justifyContent: "center",
    padding: 20,
  },

  logoBox: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  tagline: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#666",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});