import Header from "../../components/Header";
import BannerSlider from "../../components/BannerSlider";
import ProductRow from "../../components/ProductRow";

import {
  ScrollView,
  View,
  Text,
  RefreshControl,
} from "react-native";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewCartBar from "../../components/ViewCartBar";

export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refreshDeliverySettings = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) return;

      const user = JSON.parse(userData);

      if (!user.village || !user.pincode) return;

      const response = await fetch(
        "https://api.harzo.in/api/delivery/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.village,
            pincode: user.pincode,
          }),
        }
      );

      const deliveryData = await response.json();

      if (deliveryData.available) {
        await AsyncStorage.setItem(
          "deliverySettings",
          JSON.stringify(deliveryData)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadData = () => {
    fetch("https://api.harzo.in/api/product-categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.log("CATEGORY ERROR", err);
      });

    fetch("https://api.harzo.in/api/all-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        console.log("PRODUCT ERROR", err);
      });
  };

  useEffect(() => {
    refreshDeliverySettings();
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    loadData();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 190 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
<Header />
<BannerSlider />



{categories.map((category) => (
  <ProductRow
    key={category._id}
    title={category.name}
    products={products.filter((p) => {
      const productCategory =
        p?.categoryId?.name ||
        p?.categoryName ||
        "";

      return (
        productCategory.trim().toLowerCase() ===
        category.name.trim().toLowerCase()
      );
    })}
  />
))}
      </ScrollView>

      <ViewCartBar />
    </View>
  );
}