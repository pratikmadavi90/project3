import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api.harzo.in/api";

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
    const token =
await AsyncStorage.getItem("token");

const res = await fetch(
 `${API_URL}/orders/${orderId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      const data = await res.json();

      setOrder(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const callDeliveryBoy = () => {
    if (!order?.deliveryBoy?.phone) return;

    Linking.openURL(
      `tel:${order.deliveryBoy.phone}`
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.heading}>
          Order Details
        </Text>

        <Text style={styles.label}>
          Order ID
        </Text>

        <Text style={styles.value}>
          {order?.orderId || "-"}
        </Text>

        <Text style={styles.label}>
          Delivery Partner
        </Text>

        <Text style={styles.value}>
          {order?.deliveryBoy?.name ||
            "Not Assigned Yet"}
        </Text>

        <Text style={styles.label}>
          Mobile Number
        </Text>

        <Text style={styles.value}>
          {order?.deliveryBoy?.phone || "-"}
        </Text>

        <Text style={styles.label}>
          Assigned Date & Time
        </Text>

        <Text style={styles.value}>
          {order?.deliveryAssignedAt
            ? new Date(
                order.deliveryAssignedAt
              ).toLocaleString()
            : "-"}
        </Text>

        {order?.deliveryBoy?.phone && (
          <TouchableOpacity
            style={styles.callBtn}
            onPress={callDeliveryBoy}
          >
            <Text style={styles.callText}>
              Call Delivery Boy
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: "#666",
    marginTop: 15,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  callBtn: {
    marginTop: 25,
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  callText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});