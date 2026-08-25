import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: "#0C8A7B",
        tabBarInactiveTintColor: "gray",

        tabBarIcon: ({ color }) => {
          let iconName: any;

          if (route.name === "index") iconName = "home";
          else if (route.name === "cart") iconName = "cart";
          else if (route.name === "footwear")iconName = "footsteps";
          else if (route.name === "search") iconName = "search";
          else if (route.name === "profile") iconName = "person";

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },

        tabBarStyle: {
          
          height:
            Platform.OS === "android"
              ? 70 + insets.bottom
              : 85,

          paddingTop: 8,

          paddingBottom:
            Platform.OS === "android"
              ? 8 + insets.bottom
              : 20,

          backgroundColor: "#ffffff",

          borderTopWidth: 0,

          elevation: 15,

          position: "absolute",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

 <Tabs.Screen
  name="footwear"
  options={{
    title: "Footwear",
  }}
/>     

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      <Tabs.Screen
        name="category"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="product-detail"
        options={{
          href: null,
        }}
      />

<Tabs.Screen
  name="footwear-products"
  options={{
    href: null,
  }}
/>

<Tabs.Screen
  name="footwear-product-detail"
  options={{
    href: null,
  }}
/>

    </Tabs>
  );
}