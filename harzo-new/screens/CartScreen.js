import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCart } from "../context/CartContext";
import { router } from "expo-router";

export default function CartScreen() {

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
  } = useCart();

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

      const userData =
        await AsyncStorage.getItem("user");

      // ✅ NO ADDRESS
      if (!userData) {

        router.push("/address");
        return;
      }

      const user = JSON.parse(userData);

      if (
        !user?.address ||
        !user?.city ||
        !user?.pincode
      ) {

        router.push("/address");

      } else {

        // ✅ GO TO PAYMENT
        router.push("/payment");
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong"
      );
    }
  };

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
              paddingBottom: 140,
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

          <View style={styles.footer}>

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
    paddingTop: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
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

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

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
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: "#fff",

    padding: 18,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },

  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },

  checkout: {
    backgroundColor: "#facc15",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },

});