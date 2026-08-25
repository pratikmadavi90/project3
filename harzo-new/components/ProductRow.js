import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

export default function ProductRow({
  products = [],
  title,
}) {
  const router = useRouter();

  const displayProducts = products.slice(0, 8);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.grid}>
        {displayProducts.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category",
                params: {
                  category: title,
                },
              })
            }
          >
            <Image
              source={{
                uri:
                  item?.images?.[0] ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.image}
              contentFit="contain"
            />

            <Text
              numberOfLines={2}
              style={styles.name}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 15,
    paddingHorizontal: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    marginBottom: 10,

    elevation: 2,
  },

  image: {
    width: "100%",
    height: 55,
  },

  name: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
});