import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function FootwearCheckout() {
  const { product } = useLocalSearchParams();

  const item = JSON.parse(product as string);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Delivery");

  const mrp =
    item?.mrp ||
    item?.pricing?.mrp ||
    0;

  const sellingPrice =
    item?.sellingPrice ||
    item?.pricing?.salePrice ||
    item?.price ||
    0;

  const discount = mrp - sellingPrice;

const placeOrder = async () => {

  try {

    const userData =
      await AsyncStorage.getItem("user");

    if (!userData) {
      Alert.alert(
        "Error",
        "Please login first"
      );
      return;
    }

    const user =
      JSON.parse(userData);

const orderData = {

  orderId: "FWO" + Date.now(),

  userId: user.userId,

  email: user.email,

  customerName: user.name,

  phone: user.phone,

  address: user.address,

  city: user.city,

  pincode: user.pincode,

  productId: item._id,

  productName: item.name,

  productImage:
    item.image ||
    item.images?.[0] ||
    "",

  size: item.selectedSize,

  mrp,

  sellingPrice,

  discount,

  paymentMethod,

  paymentStatus:
    paymentMethod === "Pay Online"
      ? "Paid"
      : "Pending",

  totalAmount: sellingPrice,

};

console.log(
  "FOOTWEAR ORDER =",
  JSON.stringify(orderData, null, 2)
);   

const response = await fetch(
  "https://api.harzo.in/api/footwear-orders/create",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  }
);

const result = await response.json();

console.log(
  "ORDER RESPONSE =",
  result
);

if (!response.ok) {
  Alert.alert(
    "Error",
    result.message || "Order Failed"
  );
  return;
}

Alert.alert(
  "Success",
  "Footwear Order Placed Successfully"
);

router.replace("/success");

  } catch (err) {

    console.log(err);

  }

};

  return (
 <ScrollView
  style={{
    flex: 1,
    backgroundColor: "#f5f5f5",
  }}
  contentContainerStyle={{
    padding: 15,
    paddingBottom: 120,
  }}
>
      {/* HEADER */}

<Text
  style={{
    fontSize: 28,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 20,
    color: "#111",
  }}
>
  Checkout
</Text>

      {/* PRODUCT DETAILS */}

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 16,
          marginBottom: 15,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Product Details
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#111",
          }}
        >
          {item?.name}
        </Text>

<Text
  style={{
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  }}
>
  Size: {item?.selectedSize}
</Text>
      </View>

      {/* PRICE DETAILS */}

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 16,
          marginBottom: 20,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 15,
          }}
        >
          Price Details
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text>MRP</Text>
          <Text>₹{mrp}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text>Selling Price</Text>
          <Text
            style={{
              color: "#16a34a",
              fontWeight: "700",
            }}
          >
            ₹{sellingPrice}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text>Discount</Text>
          <Text
            style={{
              color: "red",
              fontWeight: "700",
            }}
          >
            -₹{discount}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <Text>Delivery</Text>
          <Text
            style={{
              color: "#16a34a",
              fontWeight: "700",
            }}
          >
            FREE
          </Text>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eee",
            paddingTop: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Total
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            ₹{sellingPrice}
          </Text>
        </View>
      </View>

      {/* PAYMENT */}

      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 12,
        }}
      >
        Select Payment Method
      </Text>

      {/* COD */}

      <TouchableOpacity
        onPress={() =>
          setPaymentMethod(
            "Cash On Delivery"
          )
        }
        style={{
          backgroundColor:
            paymentMethod ===
            "Cash On Delivery"
              ? "#fff7dc"
              : "#fff",
          borderRadius: 15,
          padding: 15,
          marginBottom: 12,
          borderWidth: 1,
          borderColor:
            paymentMethod ===
            "Cash On Delivery"
              ? "#facc15"
              : "#eee",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          🟡 Cash On Delivery
        </Text>

        <Text
          style={{
            color: "#666",
            marginTop: 4,
          }}
        >
          Pay after delivery
        </Text>
      </TouchableOpacity>

      {/* ONLINE */}

      <TouchableOpacity
        onPress={() =>
          setPaymentMethod(
            "Pay Online"
          )
        }
        style={{
          backgroundColor:
            paymentMethod ===
            "Pay Online"
              ? "#eef5ff"
              : "#fff",
          borderRadius: 15,
          padding: 15,
          borderWidth: 1,
          borderColor:
            paymentMethod ===
            "Pay Online"
              ? "#2563eb"
              : "#eee",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          🔵 Pay Online
        </Text>

        <Text
          style={{
            color: "#666",
            marginTop: 4,
          }}
        >
          UPI, Cards, Wallets
        </Text>
      </TouchableOpacity>

      {/* BUTTON */}

      <TouchableOpacity
        onPress={placeOrder}
        style={{
          marginTop: 30,
          backgroundColor: "#16a34a",
          height: 58,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Place Order
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}