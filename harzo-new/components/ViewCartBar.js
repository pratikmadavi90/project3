import React from "react";
import {
  View,
  Text,
  Image,
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
        bottom: 120,
        left: 30,
        right: 30,
        backgroundColor: "#16a34a",
        borderRadius: 28,
        paddingVertical: 2,
        paddingHorizontal: 12,
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
        <Image
          source={{
            uri:
              cart[0]?.images?.thumbnail ||
              cart[0]?.image,
          }}
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            backgroundColor: "#fff",
          }}
        />

        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {totalItems} Items
          </Text>

          <Text style={{ color: "#fff" }}>
            ₹{total}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 13,
        }}
      >
        View Cart →
      </Text>
    </TouchableOpacity>
  );
}