import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>

      {/* IMAGE */}
      <Image
        source={{ uri: product.images?.thumbnail }}
        style={styles.image}
      />

      {/* NAME */}
      <Text style={styles.name}>{product.name}</Text>

      {/* PRICE */}
      <Text style={styles.price}>
        ₹{product.pricing?.sellingPrice}
      </Text>

      {/* DISCOUNT (optional) */}
      <Text style={styles.discount}>
        ₹{product.pricing?.mrp}
      </Text>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "48%",
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: "green",
  },
  discount: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "line-through",
  },
  addBtn: {
    backgroundColor: "green",
    marginTop: 5,
    padding: 5,
    alignItems: "center",
    borderRadius: 5,
  },
});