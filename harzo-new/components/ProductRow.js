import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function ProductRow({ products }) {
  const router = useRouter();

  // CATEGORY GROUP
  const grouped = products.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoryNames = {
  Beverages: "Drinks & Juice",
  Snacks: "Chips & Namkeen",
  Grocery: "Daily Grocery",
  Dairy: "Dairy, Bread & Eggs",
};

  return (
    <View style={styles.container}>
      {Object.keys(grouped).map((category) => {
        const items = grouped[category];

        return (
          <TouchableOpacity
            key={category}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category",
                params: {
                  category: category,
                  products: JSON.stringify(items),
                },
              })
            }
          >
            {/* 🔥 IMAGE GRID */}
            <View style={styles.imageGrid}>
              {items.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.imageBox}>
                  <Image
                    source={{
                      uri:
                        item.images?.thumbnail ||
                        item.image ||
                        "https://via.placeholder.com/100",
                    }}
                    style={styles.image}
                  />
                </View>
              ))}
            </View>



            {/* CATEGORY NAME */}
            <Text style={styles.title}>
            {categoryNames[category] || category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 2,

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  // 🔥 MOST IMPORTANT
  imageBox: {
    width: "48%",
    height: 70,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,

    borderWidth: 1,
    borderColor: "#eee",
  },

  image: {
    width: "105%",
    height: "105%",
    resizeMode: "contain",
  },

  title: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: 6,
    fontSize: 13,
  },
});