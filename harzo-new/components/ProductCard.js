import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            product?.images?.thumbnail ||
            "https://dummyimage.com/100x100/cccccc/000000",
        }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {product?.name || "No Name"}
      </Text>

      <Text style={styles.price}>
        ₹{product?.pricing?.sellingPrice || 0}
      </Text>

      <Text style={styles.discount}>
        ₹{product?.pricing?.mrp || ""}
      </Text>

      {/* 🔥 ADD BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.7}
        onPressIn={() => {
          console.log("CLICKED");
          addToCart(product);
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          ADD
        </Text>
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
    zIndex: 999,
    elevation: 5,
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
    padding: 6,
    alignItems: "center",
    borderRadius: 6,
    zIndex: 999,
    elevation: 5,
  },
});