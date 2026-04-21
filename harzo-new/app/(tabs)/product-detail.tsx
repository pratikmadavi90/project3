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

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { item, allProducts } = useLocalSearchParams();

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<any>(null);
  const scrollRef = useRef<any>(null);

const [product, setProduct] = useState<any>(null);

useEffect(() => {
  try {
    const parsed =
      typeof item === "string" ? JSON.parse(item) : item;

    setProduct(parsed);
    setActiveIndex(0);

    scrollRef.current?.scrollTo({ y: 0, animated: true });
  } catch (e) {}
}, [item]);

  // ✅ IMAGES (MULTIPLE SUPPORT)
  const images =
    product?.images?.all?.length > 0
      ? product.images.all
      : product?.images?.thumbnail
      ? [product.images.thumbnail]
      : [];

    const parsedAllProducts =
  typeof allProducts === "string"
    ? JSON.parse(allProducts)
    : [];  

  // ✅ ALL PRODUCTS
 const similarProducts = parsedAllProducts.filter(
  (p: any) =>
    p?.category?.toLowerCase() === product?.category?.toLowerCase() &&
    p?.subCategory?.toLowerCase() === product?.subCategory?.toLowerCase() &&
    p?._id !== product?._id
);

  

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef} style={styles.container}>
        {/* 🔥 IMAGE SLIDER */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => {
                  setZoomImage(item);
                  setZoomVisible(true);
                }}
              >
                <Image source={{ uri: item }} style={styles.image} />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* 🔥 DETAILS */}
        <View style={styles.details}>
          <Text style={styles.name}>{product?.name}</Text>
          <Text style={[styles.weight, { fontWeight: "bold", color: "#000" }]}>
         {product?.weight || "N/A"}
         </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{product?.pricing?.sellingPrice}
            </Text>

            {product?.pricing?.mrp && (
              <Text style={styles.mrp}>
                ₹{product?.pricing?.mrp}
              </Text>
            )}

            {product?.pricing?.mrp && (
              <Text style={styles.discount}>
                {Math.round(
                  ((product.pricing.mrp -
                    product.pricing.sellingPrice) /
                    product.pricing.mrp) *
                    100
                )}
                % OFF
              </Text>
            )}
          </View>

          <Text style={styles.desc}>
            {product?.description || "No description available"}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 6 }}>
            <Text style={{ color: "green", fontWeight: "600" }}>
              🚚 60 MINS
            </Text>
            <Text style={{ marginLeft: 12 }}>⭐ 4.5</Text>
          </View>

          <View style={styles.unitBox}>
            <Text style={{ fontWeight: "bold" }}>Select Unit</Text>
            <View style={styles.unitInner}>
              <Text>{product?.weight || "N/A"}</Text>
              <Text>MRP ₹{product?.pricing?.mrp}</Text>
            </View>
          </View>
        </View>

      {/* 🔥 SIMILAR PRODUCTS (BLINKIT STYLE) */}
{similarProducts.length > 0 && (
  <View style={{ marginTop: 15 }}>
    <Text style={styles.similarTitle}>Similar Products</Text>

    <FlatList
      data={similarProducts}
      numColumns={3}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          style={styles.blinkCard}
          onPress={() =>
            router.replace({
              pathname: "/product-detail",
              params: {
                item: JSON.stringify({
                  ...item,
                  allProducts: parsedAllProducts,
                }),
              },
            })
          }
        >
          <Image
            source={{ uri: item?.images?.thumbnail }}
            style={styles.blinkImg}
          />

          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>

          <Text numberOfLines={2} style={styles.blinkName}>
            {item?.name}
          </Text>

          {/* Delivery */}
          <Text style={styles.deliveryText}>
            ⚡ {item?.deliveryTime || "1 Day"}
          </Text>

         {/* Price Row */}
<View style={styles.priceRow}>
  <Text style={styles.blinkPrice}>
    ₹{item?.pricing?.sellingPrice}
  </Text>

  {item?.pricing?.mrp && (
    <Text style={styles.mrpText}>
      ₹{item?.pricing?.mrp}
    </Text>
  )}
</View>

{/* 🔥 Discount alag line me */}
{item?.pricing?.mrp && (
  <Text style={styles.discountText}>
    {Math.round(
      ((item.pricing.mrp - item.pricing.sellingPrice) /
        item.pricing.mrp) *
        100
    )} % OFF
  </Text>
)} 
          
        </TouchableOpacity>
      )}
    />
  </View>
)}

        {/* 🔥 ZOOM MODAL */}
        <Modal visible={zoomVisible} transparent>
          <View style={styles.zoomBg}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setZoomVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: zoomImage || "" }}
              style={styles.zoomImg}
            />
          </View>
        </Modal>
      </ScrollView>

      {/* 🔥 BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {product?.stock?.weight}
          </Text>
          <Text>₹{product?.pricing?.sellingPrice}</Text>
        </View>

        <TouchableOpacity style={styles.cartBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
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
    paddingBottom: 80,
  },

  imageContainer: {
    width: width,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  image: {
    width: width * 13,
    height: 330,
    resizeMode: "contain",
  },

  details: {
    backgroundColor: "#fff",
    marginTop: -20,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  name: { fontSize: 20, fontWeight: "bold" },
  weight: { fontSize: 13, color: "#777" },

  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 20, fontWeight: "bold" },
  mrp: { marginLeft: 8, textDecorationLine: "line-through", color: "#888" },
  discount: { marginLeft: 8, color: "green" },

  desc: { marginTop: 6, color: "#555" },

  unitBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  unitInner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
  },

  similarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
  },

  // 🔥 BLINKIT STYLE
  blinkCard: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    minHeight: 160, 
  },

  blinkImg: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },

  addBtn: {
    position: "absolute",
    top: 75,
    right: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  addText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 12,
  },

  blinkName: {
  fontSize: 12,
  marginTop: 6,
  minHeight: 32, 
},

  blinkWeight: { fontSize: 11, color: "#777" },
  blinkPrice: { fontSize: 14, fontWeight: "bold", marginTop: 4 },

  zoomBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  zoomImg: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },

  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
  },

  bottomBar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
  },


deliveryText: {
  color: "#16A34A",
  fontSize: 12,
  marginTop: 4,
},



mrpText: {
  textDecorationLine: "line-through",
  color: "gray",
  fontSize: 12,
},

discountText: {
  color: "green",
  fontSize: 12,
  fontWeight: "600",
  marginLeft: 4,
},
});