import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function Success() {

  return (

    <View style={styles.container}>

      {/* TICK */}

      <View style={styles.circle}>

        <Text style={styles.tick}>
          ✓
        </Text>

      </View>

      <Text style={styles.title}>
        Order Placed Successfully
      </Text>

      <Text style={styles.subtitle}>
        Your order has been confirmed
      </Text>

      {/* BUTTONS */}

      <TouchableOpacity
        style={styles.orderBtn}
        onPress={() =>
          router.replace("/orders")
        }
      >

        <Text style={styles.orderText}>
          View Orders
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() =>
          router.replace("/")
        }
      >

        <Text style={styles.homeText}>
          Continue Shopping
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  circle: {

    width: 120,
    height: 120,

    borderRadius: 60,

    backgroundColor: "#22c55e",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 30,
  },

  tick: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },

  orderBtn: {

    backgroundColor: "#facc15",

    width: "100%",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",

    marginBottom: 15,
  },

  orderText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  homeBtn: {

    borderWidth: 1,
    borderColor: "#ddd",

    width: "100%",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",
  },

  homeText: {
    color: "#111",
    fontSize: 17,
    fontWeight: "600",
  },

});