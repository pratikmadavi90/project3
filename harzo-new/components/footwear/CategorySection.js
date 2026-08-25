import React from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";

import ProductBox from "./ProductBox";

export default function CategorySection({
  title,
  products,
  onProductPress,
}) {


  
  return (
    <View style={{ marginTop: 15 }}>
<View
  style={{
    height: 35,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
  }}
>
  <Text
    numberOfLines={1}
    style={{
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
      paddingHorizontal: 12,
    }}
  >
    {Array(10).fill(title).join(" • ")}
  </Text>
</View>

      <FlatList
        data={products.slice(0, 4)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductBox
            item={item}
            onPress={() => onProductPress(item)}
          />
        )}
      />
    </View>
  );
}