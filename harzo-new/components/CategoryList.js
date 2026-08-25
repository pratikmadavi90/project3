import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";


export default function CategoryList() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((item, index) => (
   <TouchableOpacity
  key={index}
  style={styles.box}
  onPress={() => {
    router.push({
      pathname: "/category",
      params: {
        category: item.category,
        subCategory: item.subCategory,
      },
    });
  }}
>
  <Text style={styles.text}>{item.title}</Text>
</TouchableOpacity>

      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  box: {
    backgroundColor: "#e6e6e6",   // 👈 visible color
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
});