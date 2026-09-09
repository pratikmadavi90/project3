import React from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";

export default function ProductBox({ item, onPress }) {
const discountPercent =
  item?.mrp > 0
    ? Math.round(
        ((item.mrp - item.sellingPrice) /
          item.mrp) *
          100
      )
    : 0;

  return (
<TouchableOpacity
  style={{
    width: "49%",
    marginBottom: 12,
  }}
  onPress={onPress}
>
  {/* Image Box */}
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 7,
      overflow: "hidden",
      elevation: 2,
    }}
  >
    <Image
      source={{ uri: item?.images?.[0] }}
      style={{
        width: "100%",
        height: 175,
        height: 190,
      }}
      resizeMode="cover"
    />
  </View>

  {/* Text Area */}
  <View style={{ paddingTop: 6 }}>
    <Text
      numberOfLines={1}
      style={{
        fontSize: 14,
        fontWeight: "600",
      }}
    >
      {item?.name}
    </Text>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#888",
          textDecorationLine: "line-through",
          marginRight: 6,
        }}
      >
        ₹{item?.mrp}
      </Text>

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        ₹{item?.sellingPrice}
      </Text>

<Text
  style={{
    marginLeft: 55,
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  }}
>
  {discountPercent}% OFF
</Text>

    </View>
  </View>
</TouchableOpacity>
  );
}