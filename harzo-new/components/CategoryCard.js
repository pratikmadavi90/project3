import { View, Text, Image } from "react-native";

export default function ProductCard({ item }) {
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
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 100, borderRadius: 8 }}
      />

      <Text style={{ marginTop: 5, fontWeight: "600" }}>
        {item.name}
      </Text>
    </View>
  );
}