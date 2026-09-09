import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useFocusEffect } from "expo-router";

import {
  ScrollView,
  View,
  Text,
} from "react-native";
import {
  getFootwearCategories,
  getFootwearProducts,
} from "../../services/footwearService";
import CategorySection from "../../components/footwear/CategorySection";
import FootwearHeader from "../../components/footwear/FootwearHeader";

import { router } from "expo-router";

export default function FootwearScreen() {
  const [categories, setCategories] = useState<any[]>([]);
const [products, setProducts] = useState<any[]>([]);
const [footwearEnabled, setFootwearEnabled] =
  useState(true);

// useEffect(() => {
//   loadCategories();
//   loadProducts();
//   loadFootwearSetting();
// }, []);

useEffect(() => {
  const interval = setInterval(() => {
    loadFootwearSetting();
    loadCategories();
    loadProducts();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const loadCategories = async () => {
    try {

const data = await getFootwearCategories();



setCategories(data.categories || []);

      
    } catch (error) {
      console.log(
        "CATEGORY ERROR:",
        error
      );
    }
  };

  const loadProducts = async () => {
  try {
    const data = await getFootwearProducts();

    console.log(
      "FOOTWEAR PRODUCTS:",
      data
    );

    console.log("PRODUCTS:", data.products);

    setProducts(data.products || []);
  } catch (error) {
    console.log(
      "PRODUCT ERROR:",
      error
    );
  }
};

const loadFootwearSetting = async () => {
  try {

    const res = await fetch(
      "https://api.harzo.in/api/footwear-settings"
    );

    const data = await res.json();

console.log(
  "FOOTWEAR SETTINGS:",
  data
);    

    setFootwearEnabled(
      data.enabled || false
    );

  } catch (error) {

    console.log(
      "FOOTWEAR SETTINGS ERROR:",
      error
    );

  }
};


if (!footwearEnabled) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F5F5F5",
      }}
    >
      <FootwearHeader />

      <View
        style={{
          margin: 20,
          backgroundColor: "#fff",
          padding: 30,
          borderRadius: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          🚧
        </Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Coming Soon
        </Text>

        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            color: "#666",
          }}
        >
          Footwear Store will be available soon.
        </Text>
      </View>
    </ScrollView>
  );
}

return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#F5F5F5",
    }}
    contentContainerStyle={{
      paddingTop: 0,
      paddingBottom: 150,
    }}
  >

 <FootwearHeader /> 
    {categories.map((category) => (
      <CategorySection
        key={category._id}
        title={category.name}
        products={products
          .filter(
            (p) =>
              p.category?._id === category._id
          )
          .slice(0, 4)}
onProductPress={(product: any) => {
  router.push({
    pathname: "/footwear-products",
    params: {
      categoryId: category._id,
      categoryName: category.name,
    },
  });
}}
      />
    ))}
  </ScrollView>
);
}