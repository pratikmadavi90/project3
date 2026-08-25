import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";

export default function ViewCartBar() {
  const router = useRouter();
  const { cart, total } = useCart();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (totalItems === 0) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/cart")}
      style={{
        position: "absolute",
        bottom: 115,
        left: 50,
        right: 50,
        backgroundColor: "#16a34a",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {totalItems} Items
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            marginLeft: 10,
            fontWeight: "600",
          }}
        >
          ₹{total}
        </Text>
      </View>

<Text
  style={{
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 10,
  }}
>
  View Cart →
</Text>
    </TouchableOpacity>
  );
}