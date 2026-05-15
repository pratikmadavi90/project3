// @ts-nocheck

import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { useCart } from "../context/CartContext";

import RazorpayCheckout from "react-native-razorpay";

const Razorpay = RazorpayCheckout;

export default function Payment() {

  const [loading, setLoading] = useState(false);

  const {
    cart,
    total,
    clearCart,
  } = useCart();

  // ✅ CALCULATIONS

  const deliveryCharge =
    total > 499 ? 0 : 40;

  const gst = Math.floor(total * 0.05);

  const discount =
    total > 999 ? 100 : 0;

  const finalTotal =
    total +
    deliveryCharge +
    gst -
    discount;

  // ✅ PLACE ORDER

  const placeOrder = async (method) => {

    try {

      setLoading(true);

      const userData =
        await AsyncStorage.getItem("user");
console.log("USER DATA:", userData);

      const user = userData
        ? JSON.parse(userData)
        : null;
console.log("PARSED USER:", user); 


console.log(
  "CART DATA FULL:",
  JSON.stringify(cart, null, 2)
);


const orderData = {

  id: Date.now(),

  // ✅ MATCH MONGODB SCHEMA
  user: {
    name: user?.name || "",
    phone: user?.phone || "",
  },

  address: {
    fullAddress: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
  },

items: cart.map((item) => ({

  productId:
    item._id || "",

  name:
    item.name || "",

  weight:
    item.weight ||
    item.size ||
    item.unit ||
    item.quantityText ||
    "",

  price:
    item.price ||
    item.pricing?.mrp ||
    item.pricing?.salePrice ||
    item.pricing?.price ||
    0,

  qty:
    item.quantity ||
    item.qty ||
    1,

  image:
    item.image ||
    item.thumbnail ||
    item.images?.thumbnail ||
    item.images?.[0]?.url ||
    item.images?.[0]?.thumbnail ||
    "https://via.placeholder.com/100",

})),

  totalAmount: finalTotal,

  finalAmount: finalTotal,

  payment: {
    method: method,
    status:
      method === "Razorpay"
        ? "Paid"
        : "Pending",
  },

  status: "Pending",

  createdAt: new Date(),
};

      // ✅ SAVE LOCAL

      const ordersData =
        await AsyncStorage.getItem("orders");

      const existingOrders = ordersData
        ? JSON.parse(ordersData)
        : [];

      existingOrders.unshift(orderData);

      await AsyncStorage.setItem(
        "orders",
        JSON.stringify(existingOrders)
      );

      // ✅ API SAVE

      try {

        await fetch(
          "https://api.harzo.in/api/orders/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(orderData),
          }
        );

      } catch (e) {

        console.log("API ERROR:", e);
      }

      // ✅ CLEAR CART
      // TESTING KE LIYE OFF HAI
     await clearCart(); 

      Alert.alert(
        "Success",
        "Order Placed Successfully"
      );

      router.replace("/success");

    } catch (error) {

      console.log("ORDER ERROR:", error);

      Alert.alert(
        "Error",
        "Failed To Place Order"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <Text style={styles.title}>
        Checkout
      </Text>

      {/* ADDRESS */}

      <View style={styles.addressBox}>

        <Text style={styles.sectionTitle}>
          Delivery Address
        </Text>

        <Text style={styles.addressText}>
          Home Delivery
        </Text>

      </View>

      {/* PRICE DETAILS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Price Details
        </Text>

        <View style={styles.row}>

          <Text style={styles.label}>
            Subtotal
          </Text>

          <Text style={styles.value}>
            ₹{total}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            Delivery Charge
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  deliveryCharge === 0
                    ? "green"
                    : "#111",
              },
            ]}
          >

            {
              deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`
            }

          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            GST
          </Text>

          <Text style={styles.value}>
            ₹{gst}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            Discount
          </Text>

          <Text
            style={[
              styles.value,
              { color: "green" },
            ]}
          >
            - ₹{discount}
          </Text>

        </View>

        <View style={styles.divider} />

        <View style={styles.row}>

          <Text style={styles.totalText}>
            Total Amount
          </Text>

          <Text style={styles.totalPrice}>
            ₹{finalTotal}
          </Text>

        </View>

      </View>

      {/* PAYMENT */}

      <Text style={styles.sectionTitle}>
        Select Payment Method
      </Text>

      {/* COD */}

      <TouchableOpacity
        style={[
          styles.paymentCard,
          styles.codCard,
        ]}
        onPress={() =>
          placeOrder("Cash On Delivery")
        }
      >

        <View style={styles.iconCircle}>

          <Text style={styles.iconText}>
            ₹
          </Text>

        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.paymentTitle}>
            Cash On Delivery
          </Text>

          <Text style={styles.paymentDesc}>
            Pay after delivery
          </Text>

        </View>

        <Text style={styles.arrow}>
          →
        </Text>

      </TouchableOpacity>

      {/* ONLINE */}

      <TouchableOpacity
        style={[
          styles.paymentCard,
          styles.onlineCard,
        ]}
        onPress={() => {

          try {

            const options = {

              description:
                "Harzo Demo Payment",

              image:
                "https://harzo.in/favicon.png",

              currency: "INR",

              key:
                "rzp_test_1DP5mmOlF5G5ag",

              amount:
                finalTotal * 100,

              name: "Harzo",

              prefill: {
                email:
                  "test@harzo.in",
                contact:
                  "9999999999",
                name:
                  "Harzo User",
              },

              theme: {
                color: "#2563eb",
              },
            };

            Razorpay.open(options)

              .then((data) => {

                Alert.alert(
                  "Payment Success",
                  data?.razorpay_payment_id ||
                    "Success"
                );

                placeOrder("Razorpay");
              })

              .catch((error) => {

                console.log(
                  "PAYMENT ERROR:",
                  error
                );

                Alert.alert(
                  "Payment Cancelled"
                );
              });

          } catch (err) {

            console.log(
              "RAZORPAY ERROR:",
              err
            );

            Alert.alert(
              "Payment Failed"
            );
          }

        }}
      >

        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor:
                "#2563eb",
            },
          ]}
        >

          <Text style={styles.iconText}>
            ₹
          </Text>

        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.paymentTitle}>
            Pay Online
          </Text>

          <Text style={styles.paymentDesc}>
            UPI, Cards, Wallets
          </Text>

        </View>

        <Text style={styles.arrow}>
          →
        </Text>

      </TouchableOpacity>

      {
        loading && (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 20 }}
          />
        )
      }

      <View style={{ height: 50 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 22,
    color: "#111",
  },

  addressBox: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 22,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  addressText: {
    marginTop: 8,
    color: "#666",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#111",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    color: "#555",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  totalPrice: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111",
  },

  paymentCard: {

    flexDirection: "row",

    alignItems: "center",

    padding: 18,

    borderRadius: 22,

    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  codCard: {
    backgroundColor: "#fef9c3",
    borderWidth: 1,
    borderColor: "#fde047",
  },

  onlineCard: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#93c5fd",
  },

  iconCircle: {

    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: "#facc15",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  iconText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  paymentDesc: {
    marginTop: 5,
    color: "#666",
    fontSize: 14,
  },

  arrow: {
    fontSize: 26,
    color: "#555",
    fontWeight: "bold",
  },

});