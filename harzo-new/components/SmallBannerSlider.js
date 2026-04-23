import { BASE_URL } from "../config";

import { ScrollView, Image, View, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";

export default function SmallBannerSlider() {
  const [banners, setBanners] = useState([]);
  const scrollRef = useRef(null);
  const router = useRouter();

  // ✅ FETCH
useEffect(() => {
  fetch(BASE_URL + "/api/banners")
    .then((res) => res.json())
    .then((data) => {
      const small = data.filter((b) => b.type === "small");
      setBanners(small);
    })
    .catch((err) => console.log(err));
}, []);

  // 🔥 CLICK HANDLER (NEW)
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

  // ✅ SMOOTH AUTO SCROLL (FIXED)
  useEffect(() => {
    if (banners.length === 0) return;

    let scrollX = 0;

    const interval = setInterval(() => {
      scrollX += 2.5; // 🔥 smooth slow speed

      scrollRef.current?.scrollTo({
        x: scrollX,
        animated: false
      });

      // loop reset
      if (scrollX >= banners.length * 155) {
        scrollX = 0;
      }

    }, 30); // 🔥 balanced speed

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10 }}
      >
        {[...banners, ...banners].map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => handleBannerClick(item)} // ✅ CLICK ENABLED
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 15,
                marginRight: 15
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}