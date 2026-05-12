import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const API = "https://api.harzo.in/api";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadTrending();
    loadRecent();
  }, []);

  const loadTrending = async () => {
    try {
      const res = await fetch(`${API}/products/trending`);
      const json = await res.json();
      setTrending(Array.isArray(json) ? json : []);
    } catch (e) {
      console.log("Trending error:", e);
      setTrending([]);
    }
  };

  const loadRecent = async () => {
    try {
      const saved = await AsyncStorage.getItem("recentSearch");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecent(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.log("Recent error:", e);
    }
  };

  const saveRecent = async (text: string) => {
    try {
      const newRecent = [
        text,
        ...recent.filter((r) => r !== text),
      ].slice(0, 5);

      setRecent(newRecent);
      await AsyncStorage.setItem("recentSearch", JSON.stringify(newRecent));
    } catch (e) {
      console.log("Save recent error:", e);
    }
  };

  const deleteRecent = async (text: string) => {
    const updated = recent.filter((r) => r !== text);
    setRecent(updated);
    await AsyncStorage.setItem("recentSearch", JSON.stringify(updated));
  };

  const clearAllRecent = async () => {
    setRecent([]);
    await AsyncStorage.removeItem("recentSearch");
  };

  const searchProducts = async (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setData([]);
      return;
    }

    try {
      const res = await fetch(
        `${API}/products/search?q=${text}&category=${category}`
      );

      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
        saveRecent(text);
      } else {
        setData([]);
      }
    } catch (e) {
      console.log("Search error:", e);
      setData([]);
    }
  };

  const openProduct = (item: any) => {
    if (!item?._id) return;

    router.push({
      pathname: "/product-detail",
      params: {
        item: JSON.stringify(item),
        allProducts: JSON.stringify([...data, ...trending]),
      },
    });
  };

  const renderItem = ({ item }: any) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openProduct(item)}
      >
        <Image
          source={{
            uri:
              item?.images?.thumbnail ||
              "https://dummyimage.com/60x60/cccccc/000000.png",
          }}
          style={styles.img}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item?.name || "No Name"}</Text>

          {item?.weight ? (
            <Text style={styles.weight}>{item.weight}</Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{item?.pricing?.sellingPrice || 0}
            </Text>

            {item?.pricing?.mrp ? (
              <Text style={styles.mrp}>
                ₹{item.pricing.mrp}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

return (
  <SafeAreaView style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for products..."
          value={query}
          onChangeText={searchProducts}
          style={styles.input}
        />
      </View>

      {/* RECENT */}
      {!query && recent.length > 0 && (
        <View>
          <View style={styles.recentHeader}>
            <Text style={styles.title}>Recent Searches</Text>

            <TouchableOpacity onPress={clearAllRecent}>
              <Text style={styles.clear}>Clear</Text>
            </TouchableOpacity>
          </View>

          {recent.map((r, i) => (
            <View key={i} style={styles.recentItemRow}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => searchProducts(r)}
              >
                <Text>{r}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteRecent(r)}>
                <Text style={styles.cross}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* TRENDING */}
      {!query ? (
        <FlatList
          data={trending}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
        />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#fff",
  paddingHorizontal: 12,
  paddingTop: 10,
  paddingBottom: 80,
}, 

  searchBox: {
  backgroundColor: "#f1f1f1",
  borderRadius: 12,
  paddingHorizontal: 10,
  marginTop: 5,
  marginBottom: 10,
},

  input: { padding: 12 },

  title: { fontWeight: "bold", fontSize: 16 },

  clear: { color: "red", fontSize: 13 },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 8,
  },

  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 5,
  },

  cross: { fontSize: 14, marginLeft: 10 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    alignItems: "center",
  },

  img: {
    width: 80,
    height: 80,
    marginRight: 10,
  },

  name: { fontWeight: "bold" },

  weight: { fontSize: 12, color: "#777" },

  priceRow: { flexDirection: "row", marginTop: 4 },

  price: { fontWeight: "bold" },

  mrp: {
    marginLeft: 6,
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
  },
});