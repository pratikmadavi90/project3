import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

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

  const scrollRef = useRef(null);
  const router = useRouter();

  // ✅ CURRENT INDEX
  const currentIndex = useRef(0);

  // ✅ ONLY SLIDER BANNERS
  const sliderBanners = banners.filter((b) => b.type === "slider");

  // ✅ FETCH BANNERS
  const fetchBanners = async () => {
    try {
      const res = await fetch("https://api.harzo.in/banners")
      const data = await res.json();

      setBanners((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD ONCE
  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ CLICK HANDLER
  const handleBannerClick = (banner) => {
    if (!banner) return;

    if (banner.redirectType === "category") {
      router.push({
        pathname: "/category",
        params: {
          category: banner.redirectValue,
        },
      });
    } else if (banner.redirectType === "product") {
      router.push({
        pathname: "/product-detail",
        params: {
          id: banner.redirectValue,
        },
      });
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

  return (
    <View style={styles.container}>
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
  elevation: 4,
},

image: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
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