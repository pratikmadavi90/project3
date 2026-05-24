// @ts-nocheck

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import { useFocusEffect } from "@react-navigation/native";

import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

export default function ProductDetail() {

  
  const { item, allProducts } =
    useLocalSearchParams();

  const [zoomVisible, setZoomVisible] =
    useState(false);

  const [zoomImage, setZoomImage] =
    useState(null);

  const [activeIndex, setActiveIndex] =
useState(0);  

  const scrollRef = useRef(null);

  const [product, setProduct] =
    useState(null);

  // ✅ GLOBAL CART CONTEXT
  const {
    cart,
    addToCart,
    decreaseQty,
  } = useCart();

  // ✅ PRODUCT LOAD
  useEffect(() => {
    try {
      const parsed =
        typeof item === "string"
          ? JSON.parse(item)
          : item;

      setProduct(parsed);

      // ✅ SCROLL TOP
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }, 100);
    } catch (e) {
      console.log("Parse error:", e);
    }
  }, [item]);

useFocusEffect(
  React.useCallback(() => {

    const onBackPress = () => {

      router.back();

      return true;
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () =>
      subscription.remove();

  }, [])
);

  // ✅ SAFE PARSE
  let parsedAllProducts = [];

  try {
    parsedAllProducts =
      typeof allProducts === "string"
        ? JSON.parse(allProducts)
        : [];
  } catch (e) {
    console.log(
      "Products Parse Error:",
      e
    );
  }

  // ✅ SIMILAR PRODUCTS
  const similarProducts = useMemo(() => {
    return parsedAllProducts.filter((p) => {
      if (!product || !p) return false;

      return (
        p?.category
          ?.toLowerCase?.()
          ?.trim?.() ===
          product?.category
            ?.toLowerCase?.()
            ?.trim?.() &&
        p?._id !== product?._id
      );
    });
  }, [product, allProducts]);

  // ✅ GET QTY
  const getQty = (id) => {
    const found = cart.find(
      (p) => p?._id === id
    );

    return found
      ? found.quantity
      : 0;
  };

  // ✅ IMAGES
const images =
product?.images?.gallery?.length > 0
? product.images.gallery
: product?.images?.thumbnail
? [product.images.thumbnail]
: [];

  return (
    <View style={{ flex: 1 }}>

<TouchableOpacity
style={{
position: "absolute",
top: 50,
left: 15,
zIndex: 999,
backgroundColor: "#fff",
width: 40,
height: 40,
borderRadius: 20,
justifyContent: "center",
alignItems: "center",
elevation: 5,
}}
onPress={() => router.back()}
>
<Ionicons
name="arrow-back"
size={22}
color="#000"
/>
</TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* IMAGE SLIDER */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
onMomentumScrollEnd={(e)=>{
setActiveIndex(
Math.round(
e.nativeEvent.contentOffset.x / width
)
)
}}

          showsHorizontalScrollIndicator={
            false
          }
          keyExtractor={(
            i,
            index
          ) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setZoomImage(item);
                setZoomVisible(true);
              }}
            >
              <Image
                source={{ uri: item }}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
        />

{images.length > 1 && (

<View
style={{
flexDirection:"row",
justifyContent:"center",
marginTop:10
}}
>

{images.map((_,index)=>(

<View
key={index}
style={{
width:10,
height:10,
borderRadius:5,
marginHorizontal:5,

backgroundColor:
activeIndex===index
? "green"
: "gray"
}}
/>

))}

</View>

)}

        {/* DETAILS */}
        <View style={styles.details}>
          <Text style={styles.name}>
            {product?.name ||
              "No Name"}
          </Text>

          <Text style={styles.weight}>
            {product?.weight ||
              "N/A"}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹
              {product?.pricing
                ?.sellingPrice || 0}
            </Text>

            {product?.pricing?.mrp && (
              <Text style={styles.mrp}>
                ₹
                {
                  product?.pricing
                    ?.mrp
                }
              </Text>
            )}
          </View>

          <Text style={styles.desc}>
            {product?.description ||
              "No description"}
          </Text>

          {/* MAIN PRODUCT ADD */}
          <View
            style={{ marginTop: 10 }}
          >
            {getQty(product?._id) ===
            0 ? (
              <TouchableOpacity
                style={
                  styles.mainAddBtn
                }
                onPress={() =>
                  addToCart(product)
                }
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight:
                      "bold",
                  }}
                >
                  ADD TO CART
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.qtyBox,
                  {
                    position:
                      "relative",
                    top: 0,
                    right: 0,
                    alignSelf:
                      "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    decreaseQty(
                      product?._id
                    )
                  }
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
                  style={styles.qty}
                >
                  {getQty(
                    product?._id
                  )}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    addToCart(product)
                  }
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
          </View>
        </View>

        {/* SIMILAR PRODUCTS */}
        <Text
          style={styles.similarTitle}
        >
          Similar Products
        </Text>

        <FlatList
          data={similarProducts}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(
            item,
            index
          ) =>
            item?._id ||
            index.toString()
          }
          renderItem={({ item }) => {
            const qty = getQty(
              item?._id
            );

            return (
              <View style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                  router.push({
                      pathname:
                        "/product-detail",
                      params: {
                        item:
                          JSON.stringify(
                            item
                          ),
                        allProducts:
                          JSON.stringify(
                            parsedAllProducts
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
                        "https://dummyimage.com/100x100/cccccc/000000.png",
                    }}
                    style={styles.img}
                  />
                </TouchableOpacity>

                {/* ADD / QTY */}
                {qty === 0 ? (
                  <TouchableOpacity
                    style={
                      styles.addBtn
                    }
                    onPress={() =>
                      addToCart(item)
                    }
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
                      onPress={() =>
                        decreaseQty(
                          item?._id
                        )
                      }
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
                        styles.qty
                      }
                    >
                      {qty}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        addToCart(item)
                      }
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

                <Text
                  style={
                    styles.blinkName
                  }
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
                    {
                      item?.pricing
                        ?.sellingPrice
                    }
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
              </View>
            );
          }}
        />

        <View
          style={{ height: 100 }}
        />
      </ScrollView>

      {/* ZOOM */}
      <Modal
        visible={zoomVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.zoomBg}>
          <TouchableOpacity
            style={{
              position:
                "absolute",
              top: 60,
              right: 20,
              zIndex: 999,
            }}
            onPress={() =>
              setZoomVisible(false)
            }
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight:
                  "bold",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>

          <Image
            source={{ uri: zoomImage }}
            style={styles.zoom}
          />
        </View>
      </Modal>

      {/* CART BAR */}
      <View style={styles.bottom}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Cart:{" "}
          {cart.reduce(
            (a, b) =>
              a + b.quantity,
            0
          )}
        </Text>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() =>
            addToCart(product)
          }
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#f2f2f2",
    },

    image: {
      width,
      height: 280,
      resizeMode: "contain",
      backgroundColor:
        "#fff",
    },

    details: {
      backgroundColor:
        "#fff",
      padding: 15,
      borderRadius: 15,
      marginTop: -20,
    },

    name: {
      fontSize: 20,
      fontWeight: "bold",
    },

    blinkName: {
      fontSize: 13,
      fontWeight: "700",
      marginTop: 5,
    },

    weight: {
      fontSize: 11,
      color: "#777",
    },

    priceRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },

    price: {
      fontWeight: "bold",
    },

    mrp: {
      marginLeft: 5,
      textDecorationLine:
        "line-through",
      color: "gray",
    },

    desc: {
      marginTop: 10,
      color: "#444",
    },

    similarTitle: {
      fontSize: 16,
      fontWeight: "bold",
      margin: 10,
    },

    card: {
      flex: 1,
      backgroundColor: "#fff",
      margin: 5,
      padding: 8,
      borderRadius: 10,
      position: "relative",
    },

    img: {
      width: "100%",
      height: 80,
      resizeMode: "contain",
    },

    mainAddBtn: {
      backgroundColor:
        "#16a34a",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },

    addBtn: {
      position: "absolute",
      top: 60,
      right: 10,
      backgroundColor:
        "#16a34a",
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 3,
      zIndex: 99,
    },

    addText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12,
    },

    qtyBox: {
      position: "absolute",
      top: 60,
      right: 10,
      flexDirection: "row",
      backgroundColor:
        "#fff",
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "green",
      alignItems: "center",
      zIndex: 99,
    },

    qtyBtn: {
      padding: 5,
      fontWeight: "bold",
      fontSize: 16,
    },

    qty: {
      paddingHorizontal: 6,
      fontWeight: "bold",
    },

    delivery: {
      color: "green",
      fontSize: 11,
    },

    zoomBg: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.95)",
      justifyContent: "center",
      alignItems: "center",
    },

    zoom: {
      width: "100%",
      height: "80%",
      resizeMode: "contain",
    },

    bottom: {
      position: "absolute",
      bottom: 35,
      left: 10,
      right: 10,
      backgroundColor:
        "#fff",
      padding: 10,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      elevation: 5,
    },

    cartBtn: {
      backgroundColor:
        "green",
      padding: 10,
      borderRadius: 10,
    },
  });