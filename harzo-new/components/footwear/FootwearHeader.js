import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { getFootwearProducts } from "../../services/footwearService";

const { width } = Dimensions.get("window");

// ✅ SIDE GAP
const HORIZONTAL_PADDING = 3;

// ✅ BANNER WIDTH
const bannerWidth = width - HORIZONTAL_PADDING * 2;

// ✅ GAP
const SPACING = 12;

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const router = useRouter();

  // ✅ CURRENT INDEX
  const currentIndex = useRef(0);

  // ✅ ONLY SLIDER BANNERS
  const sliderBanners = banners.filter((b) => b.type === "slider");

  // ✅ FETCH BANNERS
  const fetchBanners = async () => {
    try {
    const res = await fetch(
  "https://api.harzo.in/banners?section=footwear"
);
      const data = await res.json();
      setLoading(false);
      setBanners((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // ✅ LOAD ONCE
useEffect(() => {
  fetchBanners();

  const interval = setInterval(() => {
    fetchBanners();
  }, 10000); // 10 second

  return () => clearInterval(interval);
}, []);

  // ✅ CLICK HANDLER
const handleBannerClick = async (banner) => {
  console.log("Banner Click Data:", banner);

  if (!banner) return;

if (banner.redirectType === "category") {
router.push({
  pathname: "/footwear-products",
  params: {
    categoryName: banner.redirectValue,
  },
});
}

 
 else if (banner.redirectType === "product") {

const productId =
  String(banner.redirectValue)
    .replace(/"/g, "")
    .trim();

const data = await getFootwearProducts();

const product = data.products?.find(
  (p) => p._id === productId
);


if (product) {
  router.push({
    pathname: "/footwear-product-detail",
    params: {
      product: JSON.stringify(product),
    },
  });
}



  } else if (
    banner.redirectType === "website" ||
    banner.redirectType === "url"
  ) {
    try {
      await Linking.openURL(banner.redirectValue);
    } catch (err) {
      console.log("URL Error:", err);
    }
  }
};

  // ✅ AUTO SLIDE FIX
  useEffect(() => {
    if (sliderBanners.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex.current + 1;

      // ✅ LAST BANNER FIX
      if (nextIndex >= sliderBanners.length) {
        nextIndex = 0;
      }

      currentIndex.current = nextIndex;
      setActiveIndex(nextIndex);

      scrollRef.current?.scrollTo({
        x: nextIndex * (bannerWidth + SPACING),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderBanners]);

  // ✅ MANUAL SWIPE INDEX
  const handleScroll = (event) => {
    const slide =
      Math.round(
        event.nativeEvent.contentOffset.x /
          (bannerWidth + SPACING)
      );

    currentIndex.current = slide;
    setActiveIndex(slide);
  };

if (loading) {
  return null;
}

return (
<View>

<View
  style={{
    backgroundColor: "#FACC15",
    paddingTop: 70,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center", // 👈 center karega
  }}
>

<Text
  style={{
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "800",
  }}
>
  ⚡ Welcome to Harzo Footwear
</Text>

<Text
  style={{
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  }}
>
   👟 Step Into Style 👟
</Text>

</View>

    <View style={styles.container}></View>
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={bannerWidth + SPACING}
        decelerationRate="fast"
        snapToAlignment="start"
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onMomentumScrollEnd={handleScroll}
      >
        {sliderBanners.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.95}
            onPress={() => handleBannerClick(item)}
            style={styles.bannerWrapper}
          >
<Image
  source={{ uri: item.image }}
  style={styles.image}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ✅ DOTS */}
      <View style={styles.dotsContainer}>
        {sliderBanners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 12,
  },

  scrollContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  // ✅ BIGGER PROFESSIONAL BANNER
bannerWrapper: {
  width: bannerWidth,
  height: bannerWidth * 0.55,
  borderRadius: 18,
  overflow: "hidden",
  marginRight: SPACING,
  backgroundColor: "#fff",
},

image: {
  width: "100%",
  height: "100%",
  resizeMode: "stretch",
},

  // ✅ DOTS
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: "#16A34A",
  },
});