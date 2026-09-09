import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { Image } from "expo-image";
import {
  useLocalSearchParams,
  router,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useFocusEffect } from "@react-navigation/native";
import ViewCartBar from "../components/ViewCartBar";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { item, id } =
    useLocalSearchParams();

const [product, setProduct] =
  useState<any>(null);

  const [zoomVisible, setZoomVisible] =
    useState(false);

  const [zoomImage, setZoomImage] =
    useState(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const scrollRef = useRef(null);

const {
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
} = useCart();

  useEffect(() => {
    try {
      const parsed =
        typeof item === "string"
          ? JSON.parse(item)
          : item;

      if (parsed) {
        setProduct(parsed);
      }
    } catch (e) {
      console.log(e);
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

const images =
  product?.images?.length > 0
    ? product.images
    : [];


const cartItem = cart.find(
  (i: any) => i._id === product?._id
);     


  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.backBtn}
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
      >
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={
            false
          }
          onMomentumScrollEnd={(e) =>
            setActiveIndex(
              Math.round(
                e.nativeEvent.contentOffset.x /
                  width
              )
            )
          }
          keyExtractor={(_, i) =>
            i.toString()
          }
          renderItem={({ item }) => (
<View style={{ position: "relative" }}>
  <TouchableOpacity
    onPress={() => {
      setZoomImage(item);
      setZoomVisible(true);
    }}
  >
    <Image
      source={{ uri: item }}
      style={styles.image}
      contentFit="contain"
      cachePolicy="memory-disk"
    />
  </TouchableOpacity>

  {product?.stock <= 0 && (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        OUT OF STOCK
      </Text>
    </View>
  )}
</View>

          )}
        />

        {images.length > 1 && (
          <View style={styles.dots}>
            {images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      activeIndex === index
                        ? "green"
                        : "gray",
                  },
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.name}>
            {product?.name ||
              "No Name"}
          </Text>

          <Text style={styles.weight}>
            {product?.weight ||
              "N/A"}
          </Text>

{product?.mrp > product?.sellingPrice && (
  <View
    style={{
      backgroundColor: "#000",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginTop: 10,
      marginBottom: 8,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
      }}
    >
      {Math.round(
        ((product.mrp - product.sellingPrice) /
          product.mrp) *
          100
      )}
      % OFF
    </Text>
  </View>
)}


{product?.stock > 0 &&
  product?.stock <= 5 && (
    <View
      style={{
        backgroundColor: "#ff9800",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        Only {product.stock} Left
      </Text>
    </View>
)}


<View style={styles.priceRow}>
  <Text style={styles.mrp}>
    ₹{product?.mrp || 0}
  </Text>

  <Text
    style={{
      fontSize: 28,
      fontWeight: "bold",
      color: "#000",
      marginLeft: 8,
    }}
  >
    ₹{product?.sellingPrice || 0}
  </Text>
</View>


{cartItem ? (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    }}
  >
    <TouchableOpacity
      onPress={() =>
        decreaseQty(product._id)
      }
      style={{
        backgroundColor: "green",
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        -
      </Text>
    </TouchableOpacity>

    <Text
      style={{
        marginHorizontal: 15,
        fontSize: 18,
        fontWeight: "bold",
      }}
    >
      {cartItem.quantity}
    </Text>

    <TouchableOpacity
onPress={() => {
  if (
    cartItem.quantity >=
    product.stock
  ) {
    return;
  }

  increaseQty(product._id);
}}

      style={{
        backgroundColor: "green",
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        +
      </Text>
    </TouchableOpacity>
  </View>
) : (
<TouchableOpacity
  disabled={product?.stock <= 0}
  onPress={() => {
    if (product?.stock <= 0) return;
    addToCart(product);
  }}
  style={{
    backgroundColor:
      product?.stock <= 0 ? "#ccc" : "#00C853",
    marginTop: 15,
    width: 90,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  }}
>
  <Text
    style={{
      color: "#fff",
      fontWeight: "bold",
      fontSize: 15,
    }}
  >
    {product?.stock <= 0 ? "OUT" : "ADD"}
  </Text>
</TouchableOpacity>
)}

<Text
  style={{
    marginTop: 20,
    fontSize: 18,
    fontWeight: "700",
  }}
>
  Description
</Text>

          <Text style={styles.desc}>
            {product?.description ||
              "No description"}
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={zoomVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.zoomBg}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() =>
              setZoomVisible(false)
            }
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>

          {zoomImage && (
<Image
  source={{
    uri: zoomImage,
  }}
  style={styles.zoom}
  contentFit="contain"
  cachePolicy="memory-disk"
/>
          )}
        </View>
      </Modal>
      <ViewCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  backBtn: {
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
  },

  image: {
    width,
    height: 360,
    
    backgroundColor: "#fff",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },

details: {
  paddingHorizontal: 14,
  paddingTop: 10,
  paddingBottom: 20,
},

name: {
  fontSize: 20,
  fontWeight: "700",
  color: "#111",
},

weight: {
  fontSize: 18,
  color: "#777",
  marginTop: 4,
},

priceRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 2,
},

  price: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
  },

mrp: {
  color: "#999",
  textDecorationLine: "line-through",
  fontSize: 16,
},

desc: {
  marginTop: 20,
  fontSize: 15,
  color: "#444",
  lineHeight: 24,
},

  zoomBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  zoom: {
    width: "100%",
    height: "80%",
    
  },

  closeBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 999,
  },
});