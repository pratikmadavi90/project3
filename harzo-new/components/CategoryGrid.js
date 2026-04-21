import { View } from "react-native";
import CategoryCard from "./CategoryCard";

const data = [
  { name: "Grocery" },
  { name: "Snacks" },
  { name: "Beverages" },
  { name: "Dairy" },
];

export default function CategoryGrid() {
  return (
    <View style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 10,
    }}>
      {data.map((item, index) => (
        <CategoryCard key={index} item={item} />
      ))}
    </View>
  );
}