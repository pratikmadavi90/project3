import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

export default function FootwearProductDetail() {
  const { addToCart } = useCart();  
  const { product } = useLocalSearchParams();

  const item = JSON.parse(product as string);

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      router.push("/footwear-products");
      return true;
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () => subscription.remove();
  }, [])
); 

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const images = item?.images || [];

  const discount =
    item?.mrp > 0
      ? Math.round(
          ((item.mrp - item.sellingPrice) /
            item.mrp) *
            100
        )
      : 0;

  return (
<ScrollView
  style={{
    flex: 1,
    backgroundColor: "#fff",
  }}
  contentContainerStyle={{
    paddingBottom: 150,
  }}
>
      {/* Images */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x /
              width
          );
          setCurrentImage(index);
        }}
      >
        {images.map((img: string, index: number) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{
              width,
              height: 417,
            }}
            resizeMode="contain"
          />
        ))}
      </ScrollView>

      {/* Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {images.map((_: any, index: number) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
 backgroundColor:
  item?.stock <= 0
    ? "#ccc"
    : selectedSize
    ? "#16a34a"
    : "#ccc",
            }}
          />
        ))}
      </View>

      <View
        style={{
          padding: 15,
        }}
      >
        {/* Brand */}
        <Text
          style={{
            color: "#666",
            fontSize: 14,
          }}
        >
          {item?.brand || "Brand"}
        </Text>

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          {item?.name}
        </Text>

        {/* Price */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              textDecorationLine:
                "line-through",
              color: "#888",
              fontSize: 16,
              marginRight: 10,
            }}
          >
            ₹{item?.mrp}
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            ₹{item?.sellingPrice}
          </Text>

          <Text
            style={{
              color: "green",
              marginLeft: 10,
              fontWeight: "700",
            }}
          >
            {discount}% OFF
          </Text>
        </View>

 {/* Size */}
<Text
  style={{
    marginTop: 15,
    fontSize: 16,
    fontWeight: "700",
  }}
>
  Select Size
</Text>

<View
  style={{
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  }}
>
  {[5, 6, 7, 8, 9, 10, 11].map((size) => (
    <TouchableOpacity
      key={size}
      onPress={() => setSelectedSize(size)}
      style={{
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor:
          selectedSize === size
            ? "#16a34a"
            : "#ddd",
        backgroundColor:
          selectedSize === size
            ? "#16a34a"
            : "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color:
            selectedSize === size
              ? "#fff"
              : "#000",
          fontWeight: "700",
        }}
      >
        {size}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        {/* Stock */}
        <Text
          style={{
            marginTop: 10,
            color:
              item?.stock > 0
                ? "green"
                : "red",
            fontWeight: "700",
          }}
        >
          {item?.stock > 0
            ? "In Stock"
            : "Out Of Stock"}
        </Text>

        {/* Description */}
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Description
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: "#444",
            lineHeight: 22,
          }}
        >
          {item?.description ||
            "No description available"}
        </Text>
      </View>

      {/* Buy Now */}
<TouchableOpacity
  disabled={item?.stock <= 0}
onPress={() => {
  if (!selectedSize) {
    alert("Please select size");
    return;
  }

  router.push({
    pathname: "/footwear/checkout",
    params: {
      product: JSON.stringify({
        ...item,
        selectedSize,
      }),
    },
  });
}}

  style={{
    margin: 15,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      item?.stock > 0
        ? "#16a34a"
        : "#ccc",
  }}
>
<Text
  style={{
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  }}
>
  {item?.stock <= 0
    ? "Out Of Stock"
    : selectedSize
    ? `Buy Now - Size ${selectedSize}`
    : "Select Size First"}
</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}