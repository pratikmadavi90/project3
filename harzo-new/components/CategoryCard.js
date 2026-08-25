import { View, Text } from "react-native";
import { Image } from "expo-image";

export default function CategoryCard({ item }) {
  return (
    <View
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,

        // shadow
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 100,
          backgroundColor: "#ffffff", // andar ka box white
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
<Image
  source={{
    uri:
      item.images?.thumbnail ||
      item.images?.[0] ||
      "https://via.placeholder.com/150",
  }}
  style={{
    width: 80,
    height: 80,
  }}
  contentFit="contain"
  cachePolicy="memory-disk"
/>
      </View>

      <Text
        style={{
          marginTop: 8,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
    </View>
  );
}