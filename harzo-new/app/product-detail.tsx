import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { item, allProducts } = useLocalSearchParams();

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<any>(null);
  const scrollRef = useRef<any>(null);

  const [product, setProduct] = useState<any>(null);

  // ✅ GLOBAL CART CONTEXT
  const { cart, addToCart, decreaseQty } = useCart();

  useEffect(() => {
    try {
      const parsed =
        typeof item === "string" ? JSON.parse(item) : item;

      setProduct(parsed);

      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    } catch (e) {
      console.log("Parse error:", e);
    }
  }, [item]);

  const parsedAllProducts =
    typeof allProducts === "string"
      ? JSON.parse(allProducts)
      : [];

  const similarProducts = parsedAllProducts.filter((p: any) => {
    if (!product || !p) return false;

    return (
      p?.category?.toLowerCase?.() ===
        product?.category?.toLowerCase?.() &&
      p?._id !== product?._id
    );
  });

  // ✅ GET QTY FROM CONTEXT
  const getQty = (id: string) => {
    const item = cart.find((p) => p._id === id);
    return item ? item.quantity : 0;
  };

  const images =
    product?.images?.all?.length > 0
      ? product.images.all
      : product?.images?.thumbnail
      ? [product.images.thumbnail]
      : [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
      >
        {/* IMAGE SLIDER */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(i, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
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

        {/* DETAILS */}
        <View style={styles.details}>
          <Text style={styles.name}>
            {product?.name || "No Name"}
          </Text>

          <Text style={styles.weight}>
            {product?.weight || "N/A"}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{product?.pricing?.sellingPrice || 0}
            </Text>

            {product?.pricing?.mrp && (
              <Text style={styles.mrp}>
                ₹{product?.pricing?.mrp}
              </Text>
            )}
          </View>

          <Text style={styles.desc}>
            {product?.description || "No description"}
          </Text>

          {/* MAIN PRODUCT ADD */}
          <View style={{ marginTop: 10 }}>
            {getQty(product?._id) === 0 ? (
              <TouchableOpacity
                style={styles.mainAddBtn}
                onPress={() => addToCart(product)}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
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
                    position: "relative",
                    top: 0,
                    right: 0,
                    alignSelf: "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => decreaseQty(product)}
                >
                  <Text style={styles.qtyBtn}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>
                  {getQty(product?._id)}
                </Text>

                <TouchableOpacity
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* SIMILAR PRODUCTS */}
        <Text style={styles.similarTitle}>
          Similar Products
        </Text>

        <FlatList
          data={similarProducts}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }: any) => {
            const qty = getQty(item._id);

            return (
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/product-detail",
                      params: {
                        item: JSON.stringify(item),
                        allProducts:
                          JSON.stringify(parsedAllProducts),
                      },
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        item?.images?.thumbnail ||
                        "https://dummyimage.com/100x100/cccccc/000000.png",
                    }}
                    style={styles.img}
                  />
                </TouchableOpacity>

                {/* ADD / QTY */}
                {qty === 0 ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.addText}>ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyBox}>
                    <TouchableOpacity
                      onPress={() => decreaseQty(item)}
                    >
                      <Text style={styles.qtyBtn}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qty}>
                      {qty}
                    </Text>

                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                    >
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.blinkName}>
                  {item?.name}
                </Text>

                <Text style={styles.weight}>
                  {item?.weight || "N/A"}
                </Text>

                <Text style={styles.delivery}>
                  ⚡ 1 Day delivery
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    ₹{item?.pricing?.sellingPrice}
                  </Text>

                  <Text style={styles.mrp}>
                    ₹{item?.pricing?.mrp}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* ZOOM */}
        <Modal visible={zoomVisible} transparent>
          <View style={styles.zoomBg}>
            <TouchableOpacity
              onPress={() => setZoomVisible(false)}
            >
              <Text style={{ color: "#fff" }}>
                Close
              </Text>
            </TouchableOpacity>

            <Image
              source={{ uri: zoomImage }}
              style={styles.zoom}
            />
          </View>
        </Modal>
      </ScrollView>

      {/* CART BAR */}
      <View style={styles.bottom}>
        <Text>
          Cart:{" "}
          {cart.reduce(
            (a, b) => a + b.quantity,
            0
          )}
        </Text>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => addToCart(product)}
        >
          <Text style={{ color: "#fff" }}>
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  image: {
    width,
    height: 280,
    resizeMode: "contain",
  },

  details: {
    backgroundColor: "#fff",
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
    textDecorationLine: "line-through",
    color: "gray",
  },

  desc: {
    marginTop: 10,
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
  },

  img: {
    width: "100%",
    height: 80,
    resizeMode: "contain",
  },

  mainAddBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  addBtn: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "#16a34a",
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
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "green",
    alignItems: "center",
    zIndex: 99,
  },

  qtyBtn: {
    padding: 5,
    fontWeight: "bold",
  },

  qty: {
    paddingHorizontal: 6,
  },

  delivery: {
    color: "green",
    fontSize: 11,
  },

  zoomBg: {
    flex: 1,
    backgroundColor: "black",
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
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
  },
});