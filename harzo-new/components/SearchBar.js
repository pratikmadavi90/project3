import { View, Text } from "react-native";

export default function SearchBar() {
  return (
    <View style={{
      backgroundColor: "#fff",
      margin: 15,
      padding: 12,
      borderRadius: 10
    }}>
      <Text style={{ color: "#999" }}>
        Search "atta, dal..."
      </Text>
    </View>
  );
}