// @ts-nocheck

import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { useCart } from "../context/CartContext";

export default function CategoryScreen() {
  const router = useRouter();

  const {
    addToCart,
    cart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const {
    category,
    subCategory,
    products,
  } = useLocalSearchParams();

  const [selectedSubCategory, setSelectedSubCategory] =
    useState(
      subCategory
        ? subCategory.toLowerCase()
        : null
    );

  const [apiProducts, setApiProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // PARSE PRODUCTS
  let parsedProducts = [];

  try {
    parsedProducts = products
      ? JSON.parse(products)
      : [];
  } catch (err) {
    console.log("Parse Error:", err);
  }

  // API FETCH
  useEffect(() => {
    fetch("https://api.harzo.in/api/products")
      .then((res) => res.json())
      .then((data) => {
        setApiProducts(data);
      })
      .catch((err) =>
        console.log("API ERROR:", err)
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // CATEGORY CHANGE FIX
  useEffect(() => {
    setSelectedSubCategory(
      subCategory
        ? subCategory.toLowerCase()
        : null
    );
  }, [subCategory]);

  // FINAL PRODUCTS
  const finalProducts = apiProducts;

  // LEFT MENU CATEGORIES
  const subCategories = useMemo(() => {
    return [
      ...new Set(
        finalProducts
          .filter(
            (p) =>
              p.category
                ?.toLowerCase()
                .trim() ===
              category
                ?.toLowerCase()
                .trim()
          )
          .map((p) =>
            (
              p.subCategory ||
              p.subcategory
            )?.toLowerCase()
          )
          .filter(Boolean)
      ),
    ];
  }, [finalProducts, category]);

  // FILTERED PRODUCTS
  const filteredProducts =
    useMemo(() => {
      return finalProducts.filter(
        (p) =>
          p.category
            ?.toLowerCase()
            .trim() ===
            category
              ?.toLowerCase()
              .trim() &&
          (!selectedSubCategory ||
            (
              p.subCategory ||
              p.subcategory
            )?.toLowerCase() ===
              selectedSubCategory)
      );
    }, [
      finalProducts,
      category,
      selectedSubCategory,
    ]);

  // GET QTY
  const getQty = (id) => {
    const item = cart.find(
      (p) => p._id === id
    );

    return item
      ? item.quantity
      : 0;
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator
          size="large"
          color="green"
        />

        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Loading Products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {category}
      </Text>

      <View
        style={{
          flexDirection: "row",
          flex: 1,
        }}
      >
        {/* LEFT SIDE CATEGORY */}
        <View style={styles.leftMenu}>
          <FlatList
            showsVerticalScrollIndicator={
              false
            }
            data={subCategories}
            keyExtractor={(
              item,
              index
            ) =>
              item +
              index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.categoryItem,
                  selectedSubCategory ===
                    item && {
                    backgroundColor:
                      "#e8f5e9",
                    borderRadius: 10,
                  },
                ]}
                onPress={() =>
                  setSelectedSubCategory(
                    item
                  )
                }
              >
                <View
                  style={
                    styles.categoryCircle
                  }
                >
                  <Image
                    source={{
                      uri:
                        finalProducts.find(
                          (p) =>
                            (
                              p.subCategory ||
                              p.subcategory
                            )?.toLowerCase() ===
                            item
                        )?.images
                          ?.thumbnail ||
                        "https://dummyimage.com/100x100/cccccc/000000",
                    }}
                    style={
                      styles.categoryImage
                    }
                  />
                </View>

                <Text
                  style={
                    styles.categoryText
                  }
                  numberOfLines={2}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* RIGHT PRODUCTS */}
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={
              false
            }
            data={filteredProducts}
            numColumns={2}
            contentContainerStyle={{
  paddingBottom: 120
}}
            key={`products-${selectedSubCategory}`}
            ListEmptyComponent={() => (
              <View
                style={{
                  marginTop: 100,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  No Products Found
                </Text>
              </View>
            )}
            keyExtractor={(
              item,
              index
            ) =>
              item?._id ||
              index.toString()
            }
            renderItem={({ item }) => {
              const qty =
                getQty(item._id);

              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/product-detail",
                      params: {
                        item: JSON.stringify(
                          item
                        ),
                        allProducts:
                          JSON.stringify(
                            finalProducts
                          ),
                      },
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        item?.images
                          ?.thumbnail ||
                        "https://dummyimage.com/100x100/cccccc/000000",
                    }}
                    style={
                      styles.image
                    }
                  />

                  <Text
                    style={styles.name}
                    numberOfLines={2}
                  >
                    {item?.name}
                  </Text>

                  <Text
                    style={
                      styles.weight
                    }
                  >
                    {item?.weight ||
                      "N/A"}
                  </Text>

                  <Text
                    style={
                      styles.delivery
                    }
                  >
                    ⚡ 1 Day delivery
                  </Text>

                  <View
                    style={
                      styles.priceRow
                    }
                  >
                    <Text
                      style={
                        styles.price
                      }
                    >
                      ₹
                      {item?.pricing
                        ?.sellingPrice ||
                        0}
                    </Text>

                    {item?.pricing
                      ?.mrp && (
                      <Text
                        style={
                          styles.mrp
                        }
                      >
                        ₹
                        {
                          item
                            ?.pricing
                            ?.mrp
                        }
                      </Text>
                    )}
                  </View>

                  {/* ADD BUTTON */}
                  {qty === 0 ? (
                    <TouchableOpacity
                      activeOpacity={
                        0.8
                      }
                      style={
                        styles.addBtn
                      }
                      onPress={(
                        e
                      ) => {
                        e.stopPropagation();

                        addToCart(
                          item
                        );
                      }}
                    >
                      <Text
                        style={
                          styles.addText
                        }
                      >
                        ADD
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={
                        styles.qtyBox
                      }
                    >
                      <TouchableOpacity
                        onPress={(
                          e
                        ) => {
                          e.stopPropagation();

                          decreaseQty(
                            item._id
                          );
                        }}
                      >
                        <Text
                          style={
                            styles.qtyBtn
                          }
                        >
                          -
                        </Text>
                      </TouchableOpacity>

                      <Text
                        style={
                          styles.qtyText
                        }
                      >
                        {qty}
                      </Text>

                      <TouchableOpacity
                        onPress={(
                          e
                        ) => {
                          e.stopPropagation();

                          increaseQty(
                            item._id
                          );
                        }}
                      >
                        <Text
                          style={
                            styles.qtyBtn
                          }
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
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
    
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // LEFT MENU
  leftMenu: {
    width: 90,
    backgroundColor: "#f9f9f9",
  },

  categoryItem: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 5,
  },

  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 6,
  },

  // PRODUCT CARD
  card: {
    width: "48%",
    margin: "1%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  weight: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 2,
  },

  delivery: {
    fontSize: 12,
    color: "green",
    marginVertical: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
  },

  mrp: {
    marginLeft: 5,
    textDecorationLine:
      "line-through",
    color: "gray",
  },

  addBtn: {
    marginTop: 6,
    backgroundColor: "green",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
  },

  qtyBox: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 6,
    overflow: "hidden",
  },

  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },

  qtyText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});