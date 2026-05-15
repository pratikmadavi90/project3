import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://api.harzo.in/api/orders";

export default function OrdersScreen() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {

    try {

      // LOCAL ORDERS
      const localOrders =
        JSON.parse(
          await AsyncStorage.getItem("orders")
        ) || [];

      // API ORDERS
      let apiOrders = [];

      try {

        const response = await fetch(API);

        const data = await response.json();

        apiOrders = Array.isArray(data)
          ? data
          : [];

      } catch (e) {

        console.log("API ERROR:", e);
      }

      // MERGE BOTH
      const merged = [
        ...localOrders,
        ...apiOrders,
      ];

      // NEWEST FIRST
      merged.sort(
        (a, b) =>
          new Date(
            b.createdAt || Date.now()
          ) -
          new Date(
            a.createdAt || Date.now()
          )
      );

      setOrders(merged);

    } catch (error) {

      console.log("Order Error:", error);

    } finally {

      setLoading(false);
    }
  };

  // ✅ LOADING
  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#000"
        />

      </View>
    );
  }

  // ✅ EMPTY
  if (orders.length === 0) {

    return (

      <View style={styles.emptyContainer}>

        <Text style={styles.emptyTitle}>
          No Orders Yet
        </Text>

        <Text style={styles.emptyText}>
          Your placed orders will appear here
        </Text>

      </View>
    );
  }

  return (

    <FlatList
      data={orders}

      keyExtractor={(item, index) =>
        (item?._id || item?.id || index).toString()
      }

      contentContainerStyle={styles.container}

      showsVerticalScrollIndicator={false}

      renderItem={({ item }) => (

        <View style={styles.card}>

          {/* PRODUCTS */}

          <ScrollView horizontal>

            {
              item?.items?.map(
                (product, index) => (

                  <View
                    key={index}
                    style={styles.productCard}
                  >

                    <Image
                      source={{
                        uri:
                          product?.image ||
                          product?.images
                            ?.thumbnail ||
                          "https://dummyimage.com/100x100/cccccc/000000.png",
                      }}

                      style={styles.image}
                    />

                    <View
                      style={styles.details}
                    >

                      <Text
                        numberOfLines={1}
                        style={styles.title}
                      >
                        {product?.name}
                      </Text>

                      <Text style={styles.price}>
                        ₹
                        {
                          product?.price ||
                          product?.pricing
                            ?.sellingPrice ||
                          0
                        }
                      </Text>

                      <Text style={styles.qty}>
                        Qty:
                        {" "}
                        {product?.quantity ||
                          product?.qty ||
                          1}
                      </Text>

                    </View>

                  </View>
                )
              )
            }

          </ScrollView>

          {/* ORDER INFO */}

          <View style={styles.infoBox}>

            <Text style={styles.orderText}>
              Payment:
              {" "}
              {
                item?.paymentMethod ||
                "Cash On Delivery"
              }
            </Text>

            <Text style={styles.orderText}>
              Status:
              {" "}
              {item?.status || "Placed"}
            </Text>

            <Text style={styles.orderText}>
              Total:
              {" "}
              ₹
              {item?.total ||
                item?.totalAmount ||
                0}
            </Text>

          </View>

        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  card: {
    backgroundColor: "#fff",

    borderRadius: 18,

    padding: 15,

    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  productCard: {
    flexDirection: "row",
    marginRight: 15,
    width: 260,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#eee",
  },

  details: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },

  price: {
    marginTop: 6,
    fontSize: 15,
    color: "#16a34a",
    fontWeight: "600",
  },

  qty: {
    marginTop: 5,
    color: "#555",
  },

  infoBox: {
    marginTop: 15,

    borderTopWidth: 1,
    borderTopColor: "#eee",

    paddingTop: 12,
  },

  orderText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },

});