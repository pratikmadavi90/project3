import { View, Text, StyleSheet, ScrollView } from "react-native";

const categories = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Staples",
  "Snacks",
  "Beverages",
  "Cleaning",
];

export default function CategoryList() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((item, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.text}>{item}</Text>
        </View>
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