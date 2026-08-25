import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ProductBox from "../../components/footwear/ProductBox";
import { getFootwearProducts } from "../../services/footwearService";

export default function FootwearProductsScreen() {
  const { categoryId, categoryName } = useLocalSearchParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

 useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      router.push("/footwear");
      return true;
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () => subscription.remove();
  }, [])
); 

  const loadProducts = async () => {
    const data = await getFootwearProducts();

const filteredProducts =
  (data.products || []).filter(
    (item: any) =>
      item.category?._id === categoryId ||
      item.category?.name === categoryName
  );

    setProducts(filteredProducts);
  };

  return (
<ScrollView
  contentContainerStyle={{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 32,
    paddingBottom: 180,
  }}
>
      {products.map((item) => (
<ProductBox
  key={(item as any)._id}
  item={item}
  onPress={() =>
    router.push({
      pathname: "/footwear-product-detail",
      params: {
        product: JSON.stringify(item),
      },
    })
  }
/>
      ))}
    </ScrollView>
  );
}