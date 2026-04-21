import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const scrollRef = useRef(null);
  const router = useRouter();

  // ✅ FIX: index persist रहेगा
  const currentIndex = useRef(0);

  // ✅ FETCH (ONLY ON LOAD)
  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:5000/banners");
      const data = await res.json();

      // 🔥 unnecessary re-render avoid
      setBanners(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD ONCE (NO INTERVAL)
  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔥 CLICK HANDLER
  const handleBannerClick = (banner) => {
    if (!banner) return;

    if (banner.redirectType === "category") {
      router.push({
        pathname: "/category",
        params: {
          category: banner.redirectValue
        }
      });
    } 
    else if (banner.redirectType === "product") {
      router.push({
        pathname: "/product-detail",
        params: {
          id: banner.redirectValue
        }
      });
    }
  };

  // ✅ AUTO SLIDE (SMOOTH)
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;

      scrollRef.current?.scrollTo({
        x: currentIndex.current * width,
        animated: true,
      });
    }, 1500); // 🔥 smooth speed

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <View style={styles.banner}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {banners
          .filter(b => b.type === "slider") // ✅ ONLY SLIDER
          .map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handleBannerClick(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden"
  },

  image: {
    width: width,
    height: 208,
    resizeMode: "cover"
  }
});