import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
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
              <Text style={styles.name}>{item.name}</Text>
              <Text>
  ₹{item?.pricing?.sellingPrice || 0}
</Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                  <Text style={styles.btn}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity onPress={() => increaseQty(item._id)}>
                  <Text style={styles.btn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item._id)}>
              <Text style={{ color: "red" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹{total}</Text>
        <TouchableOpacity style={styles.checkout}>
          <Text style={{ color: "#fff" }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  img: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },

  name: { fontWeight: "bold" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },

  btn: {
    fontSize: 18,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },

  qty: { marginHorizontal: 10 },

  footer: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
  },

  total: { fontSize: 18, fontWeight: "bold" },

  checkout: {
    backgroundColor: "#facc15",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});