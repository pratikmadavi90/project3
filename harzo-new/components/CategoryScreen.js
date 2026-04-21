// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CategoryScreen() {

  const router = useRouter();
  const { category, subCategory, products } = useLocalSearchParams();

  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory || null);
  const [apiProducts, setApiProducts] = useState([]); // ✅ NEW

  let parsedProducts = [];

  try {
    parsedProducts = products ? JSON.parse(products) : [];
  } catch (err) {
    console.log("Parse Error:", err);
  }

  // ✅ NEW: API fallback
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setApiProducts(data);
      })
      .catch(err => console.log("API ERROR:", err));
  }, []);

  // ✅ FINAL PRODUCTS SOURCE
  const finalProducts =
    parsedProducts.length > 0 ? parsedProducts : apiProducts;

  console.log("CATEGORY:", category);
  console.log("SUB:", subCategory);
  console.log("PRODUCTS:", finalProducts.length);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{category}</Text>

      <View style={{ flexDirection: "row", flex: 1 }}>

        {/* 🔥 LEFT SIDE CATEGORY */}
        <View style={styles.leftMenu}>
          <FlatList
            data={[
              ...new Set(
                finalProducts
                  .filter(
                    (p) =>
                      p.category?.toLowerCase() === category?.toLowerCase()
                  )
                  .map((p) => (p.subCategory || p.subcategory)?.toLowerCase())
                  .filter(Boolean)
              )
            ]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  setSelectedSubCategory(item.toLowerCase());
                }}
              >

                <View style={styles.categoryCircle}>
                  <Image
                    source={{
                      uri:
                        finalProducts.find(
                          p =>
                            (p.subCategory || p.subcategory)?.toLowerCase() === item
                        )?.images?.thumbnail || "https://via.placeholder.com/100"
                    }}
                    style={styles.categoryImage}
                  />
                </View>

                <Text style={styles.categoryText} numberOfLines={2}>
                  {item}
                </Text>

              </TouchableOpacity>
            )}
          />
        </View>

        {/* 🔥 RIGHT PRODUCTS */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={finalProducts.filter(
              (p) =>
                p.category?.toLowerCase().trim().includes(category?.toLowerCase().trim()) &&
                (!selectedSubCategory ||
                  (p.subCategory || p.subcategory)?.toLowerCase() === selectedSubCategory)
            )}
            numColumns={2}
            keyExtractor={(item, index) => item._id || index.toString()}

            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/product-detail",
                    params: {
                      item: JSON.stringify(item),
                      allProducts: JSON.stringify(finalProducts) // ✅ FIXED
                    }
                  })
                }
              >

                <Image
                  source={{ uri: item.images?.thumbnail }}
                  style={styles.image}
                />

                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.weight}>
                  {item.weight || "N/A"}
                </Text>

                <Text style={styles.delivery}>
                  ⚡ 1 Day delivery
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    ₹{item.pricing?.sellingPrice}
                  </Text>

                  {item.pricing?.mrp && (
                    <Text style={styles.mrp}>
                      ₹{item.pricing?.mrp}
                    </Text>
                  )}
                </View>

                <TouchableOpacity style={styles.addBtn}>
                  <Text style={{ color: "#fff" }}>ADD</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            )}
          />
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5"
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },

  // LEFT MENU
  leftMenu: {
    width: 90,
    backgroundColor: "#f9f9f9"
  },

  categoryItem: {
    alignItems: "center",
    marginVertical: 10
  },

  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center"
  },

  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "contain"
  },

  categoryText: {
  fontSize: 13,          
  fontWeight: "bold",    
  color: "#000",         
  textAlign: "center",
  marginTop: 6
},

  // PRODUCT CARD
  card: {
    width: "48%",
    margin: "1%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain"
  },

  name: {
    fontSize: 14,
    fontWeight: "600"
  },

  weight: {
  fontSize: 13,
  fontWeight: "bold",   // 🔥 bold
  color: "#000",        // dark color
  marginVertical: 2
},

  delivery: {
    fontSize: 12,
    color: "green",
    marginVertical: 2
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2
  },

  price: {
    fontSize: 16,
    fontWeight: "bold"
  },

  mrp: {
    marginLeft: 5,
    textDecorationLine: "line-through",
    color: "gray"
  },

  addBtn: {
    marginTop: 6,
    backgroundColor: "green",
    padding: 6,
    borderRadius: 6,
    alignItems: "center"
  }
});