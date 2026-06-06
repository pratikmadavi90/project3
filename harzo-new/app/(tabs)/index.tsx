// @ts-nocheck


import Header from "../../components/Header";
import CategoryList from "../../components/CategoryList";
import BannerSlider from "../../components/BannerSlider";
import ProductRow from "../../components/ProductRow";
import SmallBannerSlider from "../../components/SmallBannerSlider";

import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  // ✅ FIRST products state
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

 const fetchProducts = () => {

  fetch("https://api.harzo.in/api/products")
    .then(res => res.json())
    .then(data => {

      console.log("DATA:", data);

      setProducts(data);

      setRefreshing(false);

    })
    .catch(err => {

      console.log("API ERROR:", err);

      setRefreshing(false);

    });
};

useEffect(() => {

  fetchProducts();

}, []);

const onRefresh = () => {

  setRefreshing(true);

  fetchProducts();
};

  // ✅ HELPER (image nikalne ke liye)
const getImage = (name) => {
  if (!products || products.length === 0) {
  return null;
}

const product = products.find(
  (p) =>
    ((p?.subCategory || p?.subcategory || "")
      .toLowerCase()
      .trim()) === name.toLowerCase().trim()
);

return (
  product?.images?.thumbnail ||
  product?.images?.gallery?.[0] ||
  (Array.isArray(product?.images)
    ? product.images[0]
    : null) ||
  "https://via.placeholder.com/100"
);
};

  // ✅ AB sections niche (IMPORTANT FIX)
 const getSections = () => [
    {
  title: "Beverages",
  data: [
    { name: "soft drinks", image: getImage("soft drinks") },
    { name: "juices", image: getImage("juices") },
    { name: "energy", image: getImage("energy") },
    { name: "water", image: getImage("water") },
    { name: "soda", image: getImage("soda") },
    { name: "cold coffee", image: getImage("cold coffee") }
  ]
},
    {
  title: "Snacks",
  data: [
    { name: "chips", image: getImage("chips") },
    { name: "namkeen", image: getImage("namkeen") },
    { name: "biscuits", image: getImage("biscuits") },
    { name: "sweets", image: getImage("sweets") },
    { name: "chocolates", image: getImage("chocolates") },
    { name: "cookies", image: getImage("cookies") }
  ]
},
    {
  title: "Grocery",
  data: [
    { name: "atta", image: getImage("atta") },
    { name: "rice", image: getImage("rice") },
    { name: "dal", image: getImage("dal") },
    { name: "oil", image: getImage("oil") },
    { name: "salt", image: getImage("salt") },
    { name: "masala", image: getImage("masala") }
  ]
},
  {
  title: "Dairy ",
  data: [
    { name: "milk", image: getImage("milk") },
    { name: "curd", image: getImage("curd") },
    { name: "bread", image: getImage("bread") },
    { name: "eggs", image: getImage("eggs") },
    { name: "butter", image: getImage("butter") },
    { name: "paneer", image: getImage("paneer") }
  ]
},
    {
      title: "Personal Care",
      data: [
        { name: "shampoo", image: getImage("shampoo") },
        { name: "soap", image: getImage("soap") },
        { name: "facewash", image: getImage("facewash") },
        { name: "cream", image: getImage("cream") },
        { name: "toothpaste", image: getImage("toothpaste") },
        { name: "perfume", image: getImage("perfume") }
      ]
    },
    {
      title: "Household",
      data: [
        { name: "detergent", image: getImage("detergent") },
        { name: "floor Cleaner", image: getImage("floor cleaner") },
        { name: "dishwash", image: getImage("dishwash") },
        { name: "phenyl", image: getImage("phenyl") },
        { name: "glass Cleaner", image: getImage("glass cleaner") },
        { name: "toilet Cleaner", image: getImage("toilet cleaner") }
      ]
    }
  ];

  return (
  <ScrollView
  contentContainerStyle={{ paddingBottom: 100 }}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
>  
      <Header />
      <CategoryList />
      <BannerSlider />
      <ProductRow products={products} />
      <SmallBannerSlider />

      <View style={{ padding: 10 }}>
        {getSections().map((section, index) => (
          <View key={index} style={{ marginBottom: 20 }}>

            <Text style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              {section.title}
            </Text>

            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}>
              {section.data.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() =>
                 router.push({
                pathname: "/subcategory",
                params: {
                category: section.title,
               subCategory: item.name,
               
              }
              })
                  }
                  style={{
                    width: "30%",
                    marginBottom: 15,
                    alignItems: "center"
                  }}
                >
                  <View style={{
                    width: 90,
                    height: 90,
                    borderRadius: 15,
                    backgroundColor: "#f1f5f9",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                   {item.image ? (
  <Image
    source={{ uri: item.image }}
    style={{ width: 80, height: 80 }}
  />
) : (
  <View
    style={{
      width: 80,
      height: 80,
    }}
  />
)}
                  </View>

                  <Text style={{
                    marginTop: 5,
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center"
                  }}>
                    {item.name}
                  </Text>

                </TouchableOpacity>
              ))}
            </View>

          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({});