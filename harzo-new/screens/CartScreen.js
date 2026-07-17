import React from "react";

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCart } from "../context/CartContext";

import { router } from "expo-router";

import * as Location from "expo-location";

import {
  getDistanceFromGoogle,
  calculateDeliveryFee,
} from "../utils/delivery";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CartScreen() {

  const insets = useSafeAreaInsets();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
  } = useCart();

  const [deliveryFee, setDeliveryFee] =
    React.useState(0);

  const [distanceKm, setDistanceKm] =
    React.useState(0);

  const getDeliveryData = async () => {

    try {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {

        Alert.alert(
          "Permission Needed",
          "Location permission is required"
        );

        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      const userLat =
        location.coords.latitude;

      const userLng =
        location.coords.longitude;

      const distance =
        await getDistanceFromGoogle(
          userLat,
          userLng
        );

      setDistanceKm(distance);

      const fee =
        calculateDeliveryFee(distance);

      setDeliveryFee(fee);

    } catch (error) {

      console.log(error);
    }
  };

  // ✅ CHECKOUT FLOW

  const handleCheckout = async () => {

    if (cart.length === 0) {

      Alert.alert(
        "Cart Empty",
        "Please add products"
      );

      return;
    }

    try {

      // ✅ GET SAVED USER

      const savedUser =
        await AsyncStorage.getItem(
          "user"
        );

      const user = savedUser
        ? JSON.parse(savedUser)
        : null;

      // ✅ PROFILE COMPLETE

      if (
        user?.name &&
        user?.phone &&
        user?.address &&
        user?.city &&
        user?.pincode
      ) {

 // ✅ GET DELIVERY AREAS

try {

const response = await fetch(
  "https://api.harzo.in/api/delivery/all"
);

  const text = await response.text();

  let areas = [];

  try {

    areas = JSON.parse(text);

  } catch {

    console.log("INVALID API RESPONSE =", text);

    // TEMPORARY BYPASS
    router.push("/payment");

    return;
  }

  // ✅ USER ADDRESS

  const fullAddress =
    `${user.address} ${user.city}`
      .toLowerCase();

  // ✅ MATCH AREA

const matchedArea =
  areas.data.find((item) =>
    fullAddress.includes(
      item.name.toLowerCase()
    )
  );

  // ❌ AREA NOT AVAILABLE

  if (!matchedArea) {

    Alert.alert(
      "Delivery Not Available",
      "Sorry, we do not deliver in your area."
    );

    return;
  }

  // ✅ PAYMENT

  router.push("/payment");

  return;

} catch (err) {

  console.log(err);

  // TEMPORARY BYPASS
  router.push("/payment");
}

        // ✅ DIRECT PAYMENT

        router.push("/payment");

        return;
      }

// ADDRESS NOT SAVED

Alert.alert(
  "Complete Profile",
  "Please complete your profile first"
);

router.push("/profile");

}
catch (error) {

  console.log("FULL ERROR =", error);

  if (error.response) {

    console.log("RESPONSE DATA =", error.response.data);
    console.log("STATUS =", error.response.status);

    Alert.alert(
      "Error",
      JSON.stringify(error.response.data)
    );

  } else {

    Alert.alert(
      "Error",
      error.message || "Something went wrong"
    );
  }
}
}


return (

      <View style={styles.container}>

        <Text style={styles.title}>
          My Cart
        </Text>

        {
          cart.length === 0 ? (

            <View style={styles.emptyContainer}>

              <Text style={styles.emptyText}>
                Your cart is empty
              </Text>

            </View>

          ) : (

            <FlatList
              data={cart}

              keyExtractor={(item, index) =>
                item._id + index
              }

              showsVerticalScrollIndicator={false}

              contentContainerStyle={{
                paddingBottom:
                  220 + insets.bottom,
              }}

              renderItem={({ item }) => (

                <View style={styles.card}>

                  <Image
                    source={{
                      uri:
                        item?.images?.thumbnail ||
                        item?.image ||
                        "https://dummyimage.com/100x100/cccccc/000000.png",
                    }}

                    style={styles.img}
                  />

                  <View style={{ flex: 1 }}>

                    <Text
                      numberOfLines={1}
                      style={styles.name}
                    >
                      {item.name}
                    </Text>

                    <Text style={styles.weight}>
                      {
                        item.weight ||
                        item.size ||
                        item.unit ||
                        item.quantityText ||
                        ""
                      }
                    </Text>

                    <Text style={styles.price}>
                      ₹
                      {
                        item?.pricing?.sellingPrice ||
                        item?.price ||
                        0
                      }
                    </Text>

                    <View style={styles.row}>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          decreaseQty(item._id)
                        }
                      >
                        <Text style={styles.btnText}>
                          -
                        </Text>
                      </TouchableOpacity>

                      <Text style={styles.qty}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          increaseQty(item._id)
                        }
                      >
                        <Text style={styles.btnText}>
                          +
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      removeFromCart(item._id)
                    }
                  >
                    <Text style={styles.remove}>
                      Remove
                    </Text>
                  </TouchableOpacity>

                </View>
              )}
            />
          )
        }

        {
          cart.length > 0 && (

            <View
              style={[
                styles.footer,
                {
                  paddingBottom:
                    Platform.OS === "android"
                      ? 18 + insets.bottom
                      : 30,
                },
              ]}
            >

              <View style={styles.totalRow}>

                <Text style={styles.totalLabel}>
                  Total
                </Text>

                <Text style={styles.total}>
                  ₹{total}
                </Text>

              </View>

              <TouchableOpacity
                style={styles.checkout}
                onPress={handleCheckout}
              >

                <Text style={styles.checkoutText}>
                  Proceed To Checkout
                </Text>

              </TouchableOpacity>

            </View>
          )
        }

      </View>
    );
  }

  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 15,
      paddingTop: 40,
    },

    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 14,
      color: "#111",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyText: {
      fontSize: 18,
      color: "#777",
      fontWeight: "500",
    },

    card: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 18,
      padding: 12,
      marginBottom: 14,
      alignItems: "center",

      elevation: 3,
    },

    img: {
      width: 80,
      height: 80,
      borderRadius: 14,
      marginRight: 12,
      backgroundColor: "#eee",
    },

    name: {
      fontSize: 16,
      fontWeight: "700",
      color: "#111",
    },

    weight: {
      fontSize: 14,
      color: "#666",
      marginTop: 2,
    },

    price: {
      fontSize: 16,
      color: "#16a34a",
      marginTop: 5,
      fontWeight: "600",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },

    qtyBtn: {
      backgroundColor: "#f3f4f6",
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },

    btnText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#111",
    },

    qty: {
      marginHorizontal: 14,
      fontSize: 16,
      fontWeight: "600",
    },

    remove: {
      color: "#ef4444",
      fontWeight: "600",
      fontSize: 13,
    },

    footer: {
      position: "absolute",
      bottom: 70,

      left: 0,
      right: 0,

      backgroundColor: "#fff",

      paddingTop: 12,
      paddingHorizontal: 18,
      paddingBottom: 18,

      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      elevation: 12,
    },

    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },

    totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#555",
    },

    total: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#111",
    },

    checkout: {
      backgroundColor: "#facc15",
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: "center",
    },

    checkoutText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12,
    },

  });