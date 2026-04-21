import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const categories = [
  {
    name: "Soft Drinks",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050154.png",
  },
  {
    name: "Fruit Juices",
    image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
  },
  {
    name: "Energy Drinks",
    image: "https://cdn-icons-png.flaticon.com/512/2935/2935394.png",
  },
  {
    name: "Soda & Mixers",
    image: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
  },
  {
    name: "Water",
    image: "https://cdn-icons-png.flaticon.com/512/728/728093.png",
  },
];

export default function SideCategory() {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  item: {
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 30, // 🔥 ROUND IMAGE
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
  },
});