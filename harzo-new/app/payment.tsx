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

// Distance (abhi fixed 10km)
const distance = 10;

// Total cart kg calculate
let totalKg = 0;

cart.forEach((item) => {

  let kg = parseFloat(
    item.weight ||
    item.size ||
    item.unit ||
    "1"
  );

  let qty =
    item.quantity ||
    item.qty ||
    1;

  totalKg += kg * qty;

});

// Delivery charge
let deliveryCharge = 0;

// Heavy charge
let heavyCharge = 0;

// Discount
let discount = 0;

// FREE DELIVERY
if (total >= 999) {

  deliveryCharge = 0;

} else {

  // Distance charge
  if (distance <= 3) {

    deliveryCharge = 20;

  } else if (distance <= 6) {

    deliveryCharge = 30;

  } else {

    deliveryCharge = 40;
  }

}

// Heavy weight charge

heavyCharge = 0;

if (totalKg > 10) {

  heavyCharge =
  Math.ceil(
    (totalKg - 10) / 10
  ) * 20;

}





// Discount
if (total >= 1500) {

  discount = 100;

}

// Final total
const finalTotal =
total +
deliveryCharge +
heavyCharge -
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


// ✅ ORIGINAL USER ID
const permanentUserId =
  user?.userId || "";

// ✅ EVERY ORDER DIFFERENT
const uniqueOrderId =
  "ORD" + Date.now();

const orderData = {

  id: uniqueOrderId,

  // ✅ ORDER ID
  orderId: uniqueOrderId,

  // ✅ SAME USER ID EVERY TIME
  userId: permanentUserId,

  userEmail:
    user?.email || "",

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
Weight
</Text>

<Text style={styles.value}>
{totalKg.toFixed(1)} kg
</Text>

</View>

<View style={styles.row}>

<Text style={styles.label}>
Heavy Charge
</Text>

<Text style={styles.value}>
{heavyCharge === 0
 ? "₹0"
 : `₹${heavyCharge}`}
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
    paddingHorizontal: 14,
    paddingTop: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },

  addressBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 2,
  },

  addressText: {
    marginTop: 6,
    color: "#666",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#111",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#555",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },

  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  paymentCard: {

    flexDirection: "row",

    alignItems: "center",

    padding: 14,

    borderRadius: 16,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 2,
  },

  codCard: {
    backgroundColor: "#fff8db",
    borderWidth: 1,
    borderColor: "#fde68a",
  },

  onlineCard: {
    backgroundColor: "#eef4ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  iconCircle: {

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#facc15",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  iconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
  },

  paymentDesc: {
    marginTop: 2,
    color: "#666",
    fontSize: 12,
  },

  arrow: {
    fontSize: 20,
    color: "#555",
    fontWeight: "bold",
  },

});