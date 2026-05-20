import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

export default function Success() {

  const [orderId, setOrderId] =
    useState("");

  const [dateTime, setDateTime] =
    useState("");

  useEffect(() => {

    generateOrderInfo();

  }, []);

  const generateOrderInfo = async () => {

    try {

      const randomId =
        "HZ" +
        Math.floor(
          100000 + Math.random() * 900000
        );

      setOrderId(randomId);

      const now = new Date();

      const formattedDate =
        now.toLocaleDateString("en-GB");

      const formattedTime =
        now.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        );

      setDateTime(
        formattedDate +
          "\n" +
          formattedTime
      );

      // ✅ GET CHECKOUT DATA
      const checkoutData =
        await AsyncStorage.getItem(
          "latestOrder"
        );

      const userData =
        await AsyncStorage.getItem(
          "user"
        );

      const user = userData
        ? JSON.parse(userData)
        : null;

      if (checkoutData) {

        const parsedOrder =
          JSON.parse(checkoutData);

        // ✅ CREATE FINAL ORDER
        const finalOrder = {

          _id:
            randomId +
            Date.now(),

          orderId: randomId,

          createdAt:
            new Date().toISOString(),

          status: "Pending",

          userEmail:
            user?.email || "",

          paymentMethod:
            parsedOrder?.paymentMethod ||
            "Cash On Delivery",

          address:
            parsedOrder?.address ||
            parsedOrder?.deliveryAddress ||
            "Home",

          total:
            parsedOrder?.total ||
            parsedOrder?.totalAmount ||
            0,

          items:
            parsedOrder?.items || [],
        };

        // ✅ OLD ORDERS
     const existingOrders =
  await AsyncStorage.getItem(
    "orders"
  );

const oldOrders =
  existingOrders
    ? JSON.parse(existingOrders)
    : [];

        // ✅ SAVE NEW ORDER
        oldOrders.unshift(finalOrder);

        await AsyncStorage.setItem(
          "orders",
          JSON.stringify(oldOrders)
        );

        // ✅ CLEAR CART
        await AsyncStorage.removeItem(
          "cart"
        );
      }

    } catch (error) {

      console.log(
        "SUCCESS SAVE ERROR:",
        error
      );
    }
  };

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* SUCCESS ICON */}

      <View style={styles.topCircle}>

        <View style={styles.innerCircle}>

          <Text style={styles.tick}>
            ✓
          </Text>

        </View>

      </View>

      {/* TITLE */}

      <Text style={styles.successText}>
        Success!
      </Text>

      <Text style={styles.title}>
        Order Placed Successfully
      </Text>

      <Text style={styles.subtitle}>
        Your order has been confirmed and will be delivered soon.
      </Text>

      {/* ORDER CARD */}

      <View style={styles.infoCard}>

        <View style={styles.row}>

          <Text style={styles.label}>
            Order ID
          </Text>

          <Text style={styles.value}>
            {orderId}
          </Text>

        </View>

        <View style={styles.line} />

        <View style={styles.row}>

          <Text style={styles.label}>
            Date & Time
          </Text>

          <Text style={styles.value}>
            {dateTime}
          </Text>

        </View>

        <View style={styles.line} />

        <View style={styles.row}>

          <Text style={styles.label}>
            Payment
          </Text>

          <Text style={styles.value}>
            Cash On Delivery
          </Text>

        </View>

      </View>

      {/* BUTTONS */}

      <TouchableOpacity
        style={styles.orderBtn}
        activeOpacity={0.8}
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
        activeOpacity={0.8}
        onPress={() =>
          router.replace("/")
        }
      >

        <Text style={styles.homeText}>
          Continue Shopping
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#f8fafc",

    alignItems: "center",

    paddingHorizontal: 24,

    paddingTop: 40,
    paddingBottom: 120,

    flexGrow: 1,
  },

  topCircle: {

    width: 130,
    height: 130,

    borderRadius: 65,

    backgroundColor: "#dcfce7",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 22,
  },

  innerCircle: {

    width: 85,
    height: 85,

    borderRadius: 43,

    backgroundColor: "#22c55e",

    justifyContent: "center",
    alignItems: "center",

    elevation: 6,
  },

  tick: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "900",
  },

  successText: {
    fontSize: 20,
    color: "#22c55e",
    fontWeight: "700",
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,

    fontSize: 16,

    color: "#64748b",

    textAlign: "center",

    lineHeight: 24,

    marginBottom: 32,
  },

  infoCard: {

    width: "100%",

    backgroundColor: "#fff",

    borderRadius: 24,

    padding: 20,

    marginBottom: 28,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  row: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",

    paddingVertical: 2,
  },

  label: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",

    width: "38%",
  },

  value: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "800",

    width: "58%",

    textAlign: "right",
  },

  line: {

    height: 1,

    backgroundColor: "#e2e8f0",

    marginVertical: 16,
  },

  orderBtn: {

    backgroundColor: "#facc15",

    width: "100%",

    paddingVertical: 14,

    borderRadius: 16,

    alignItems: "center",

    marginBottom: 16,

    elevation: 3,
  },

  orderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  homeBtn: {

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#e2e8f0",

    width: "100%",

    paddingVertical: 14,

    borderRadius: 16,

    alignItems: "center",

    marginBottom: 40,
  },

  homeText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },

});