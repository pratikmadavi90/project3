// @ts-nocheck

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  PanResponder,
} from "react-native";

import { Image } from "expo-image";

import {
  useLocalSearchParams,
  router,
} from "expo-router";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import ViewCartBar from "../../components/ViewCartBar";


export default function CategoryScreen() {
  const { category } = useLocalSearchParams();

const {
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
} = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] =useState("");
  const subCategoryListRef = useRef(null);

  useEffect(() => {
 fetch("https://api.harzo.in/api/all-products")
  .then((res) => res.json())
  .then((data) => {
    setProducts(data.products || []);
  })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

const categoryProducts = useMemo(() => {
  return products.filter(
    (p) =>
      p?.categoryName?.toLowerCase()?.trim() ===
      category?.toLowerCase()?.trim()
  );
}, [products, category]);


const subCategories = useMemo(() => {
  return [
    ...new Set(
      categoryProducts
        .map(
          (p) =>
            p?.subCategory ||
            p?.subcategory
        )
        .filter(Boolean)
    ),
  ];
}, [categoryProducts]);




const filteredProducts = useMemo(() => {
  if (!selectedSubCategory) {
    return categoryProducts;
  }

  return categoryProducts.filter(
    (p) =>
      (p?.subCategory || p?.subcategory) ===
      selectedSubCategory
  );
}, [categoryProducts, selectedSubCategory]);

const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: (_, gestureState) => {
    return Math.abs(gestureState.dx) > 20;
  },

  onPanResponderRelease: (_, gestureState) => {
    const currentIndex = subCategories.indexOf(
      selectedSubCategory
    );

    // Left Swipe
    if (gestureState.dx < -50) {
      const nextIndex =
        currentIndex === -1
          ? 0
          : Math.min(
              currentIndex + 1,
              subCategories.length - 1
            );

setSelectedSubCategory(
  subCategories[nextIndex]
);

setTimeout(() => {
  subCategoryListRef.current?.scrollToIndex({
    index: nextIndex + 1,
    animated: true,
    viewPosition: 0.5,
  });
}, 100);

    }

    // Right Swipe
    if (gestureState.dx > 50) {
const prevIndex =
  currentIndex <= 0
    ? -1
    : currentIndex - 1;

setSelectedSubCategory(
  prevIndex === -1 ? "" : subCategories[prevIndex]
);

setTimeout(() => {
  subCategoryListRef.current?.scrollToIndex({
    index: prevIndex + 1,
    animated: true,
    viewPosition: 0.5,
  });
}, 100);

    }
  },
});

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
<View
  style={styles.container}
  {...panResponder.panHandlers}
>
  <Text style={styles.title}>{category}</Text>

<View style={{ height: 50, marginTop: 8 }}>
  <FlatList
    ref={subCategoryListRef}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: 8,
      alignItems: "center",
    }}
    data={["All", ...subCategories]}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() =>
          setSelectedSubCategory(
            item === "All" ? "" : item
          )
        }
        style={{
          paddingHorizontal: 14,
          height: 34,
          justifyContent: "center",
          marginRight: 8,
          borderRadius: 18,
          backgroundColor:
            (item === "All" && !selectedSubCategory) ||
            selectedSubCategory === item
              ? "green"
              : "#eee",
        }}
      >
        <Text
          style={{
            color:
              (item === "All" && !selectedSubCategory) ||
              selectedSubCategory === item
                ? "#fff"
                : "#000",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )}
  />
</View>

  <View style={{ flex: 1 }}>    

<FlatList
  data={filteredProducts}
  numColumns={2}
  contentContainerStyle={{
    paddingBottom: 190,
  }}

  keyExtractor={(item, index) =>
    item?._id || index.toString()
  }


  renderItem={({ item }) => {

  // console.log("THUMB URL =", item?.images?.thumbnail);

  const cartItem = cart.find(
    (i) => i._id === item._id
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/product-detail",
          params: {
            item: JSON.stringify(item),
            allProducts: JSON.stringify(products),
          },
        })
      }
    >
      
<Image
  source={{
uri:
  item?.images?.[0] ||
  "https://dummyimage.com/300x300/cccccc/000000"
  }}
  style={styles.image}
  contentFit="contain"
  cachePolicy="memory-disk"
/>

            <Text
              numberOfLines={2}
              style={styles.name}
            >
              {item?.name}
            </Text>

<Text style={styles.weight}>
  {item?.weight || "N/A"}
</Text>

<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        textDecorationLine: "line-through",
        color: "#888",
        fontSize: 12,
        marginRight: 4,
      }}
    >
      ₹{item?.mrp || 0}
    </Text>

<Text
  style={{
    fontWeight: "bold",
    fontSize: 14,
    color: "#111",
  }}
>
      ₹{item?.sellingPrice || 0}
    </Text>
  </View>

{cartItem ? (
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 13,
        marginBottom: 2,
      }}
    >
      {cartItem.quantity}
    </Text>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => decreaseQty(item._id)}
        style={{
          backgroundColor: "#00C853",
          width: 28,
          height: 28,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 4,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          -
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => increaseQty(item._id)}
        style={{
          backgroundColor: "#00C853",
          width: 28,
          height: 28,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  </View>
) : (

  <TouchableOpacity
    onPress={() => addToCart(item)}
    style={{
      backgroundColor: "#00C853",
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: 4,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
      }}
    >
      ADD
</Text>
  </TouchableOpacity>
)}

</View>

</TouchableOpacity>
  );
}}
/>
    </View>
    <ViewCartBar />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

title: {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 22,
  marginLeft: 6,
},

card: {
  width: "48%",
  height: 270, 
  backgroundColor: "#fff",
  margin: "1%",
  padding: 10,
  borderRadius: 10,
},

  image: {
    width: "100%",
    height: 140,
    
  },

name: {
  fontSize: 13,
  fontWeight: "700",
  marginTop: 6,
  minHeight: 38,
  lineHeight: 18,
  color: "#111",
},

weight: {
  color: "#666",
  fontSize: 12,
  fontWeight: "500",
  marginTop: 1,
},

  price: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});