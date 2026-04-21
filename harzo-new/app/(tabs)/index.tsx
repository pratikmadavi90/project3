// @ts-nocheck


import Header from "../../components/Header";
import CategoryList from "../../components/CategoryList";
import BannerSlider from "../../components/BannerSlider";
import ProductRow from "../../components/ProductRow";
import SmallBannerSlider from "../../components/SmallBannerSlider";

import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  // ✅ FIRST products state
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setProducts(data);
      })
      .catch(err => {
        console.log("API ERROR:", err);
      });
  }, []);

  // ✅ HELPER (image nikalne ke liye)
const getImage = (name) => {
  if (!products || products.length === 0) {
    return "https://via.placeholder.com/100";
  }

  const product = products.find(
    (p) => (p?.subCategory || p?.subcategory) === name
  );

  return (
    product?.images?.thumbnail ||
    product?.images?.[0] ||
    "https://via.placeholder.com/100"
  );
};

  // ✅ AB sections niche (IMPORTANT FIX)
 const getSections = () => [
    {
  title: "Beverages",
  data: [
    { name: "Soft Drinks", image: getImage("Soft Drinks") },
    { name: "Juices", image: getImage("Juices") },
    { name: "Energy", image: getImage("Energy") },
    { name: "Water", image: getImage("Water") },
    { name: "Soda", image: getImage("Soda") },
    { name: "Cold Coffee", image: getImage("Cold Coffee") }
  ]
},
    {
  title: "Snacks",
  data: [
    { name: "Chips", image: getImage("Chips") },
    { name: "Namkeen", image: getImage("Namkeen") },
    { name: "Biscuits", image: getImage("Biscuits") },
    { name: "Sweets", image: getImage("Sweets") },
    { name: "Chocolates", image: getImage("Chocolates") },
    { name: "Cookies", image: getImage("Cookies") }
  ]
},
    {
  title: "Grocery",
  data: [
    { name: "Atta", image: getImage("Atta") },
    { name: "Rice", image: getImage("Rice") },
    { name: "Dal", image: getImage("Dal") },
    { name: "Cooking Oil", image: getImage("Cooking Oil") },
    { name: "Salt", image: getImage("Salt") },
    { name: "Masala", image: getImage("Masala") }
  ]
},
    {
  title: "Dairy",
  data: [
    { name: "Milk", image: getImage("Milk") },
    { name: "Curd", image: getImage("Curd") },
    { name: "Bread", image: getImage("Bread") },
    { name: "Eggs", image: getImage("Eggs") },
    { name: "Butter", image: getImage("Butter") },
    { name: "Paneer", image: getImage("Paneer") }
  ]
},
    {
      title: "Personal Care",
      data: [
        { name: "Shampoo", image: getImage("Shampoo") },
        { name: "Bath Soap", image: getImage("Bath Soap") },
        { name: "Facewash", image: getImage("Facewash") },
        { name: "Cream", image: getImage("Cream") },
        { name: "Toothpaste", image: getImage("Toothpaste") },
        { name: "Perfume", image: getImage("Perfume") }
      ]
    },
    {
      title: "Household",
      data: [
        { name: "Detergents", image: getImage("Detergents") },
        { name: "Floor Cleaners", image: getImage("Floor Cleaners") },
        { name: "Dishwash", image: getImage("Dishwash") },
        { name: "Phenyl", image: getImage("Phenyl") },
        { name: "Glass Cleaners", image: getImage("Glass Cleaners") },
        { name: "Toilet Cleaners", image: getImage("Toilet Cleaners") }
      ]
    }
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
                pathname: "/category",
                params: {
                category: section.title,
               subCategory: item.name,
               products: JSON.stringify(products) // 🔥 MUST ADD
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
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 80, height: 80 }}
                    />
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