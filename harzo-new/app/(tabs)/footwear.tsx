import React, { useEffect, useState } from "react";
import {
ScrollView,  
} from "react-native";;

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

useEffect(() => {
  loadCategories();
  loadProducts();
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

    setProducts(data.products || []);
  } catch (error) {
    console.log(
      "PRODUCT ERROR:",
      error
    );
  }
};

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