import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
   <Tabs
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: "#0C8A7B",
    tabBarInactiveTintColor: "gray",

    tabBarIcon: ({ color, size }) => {
      let iconName: any;

      if (route.name === "index") iconName = "home";
      else if (route.name === "cart") iconName = "cart";
      else if (route.name === "search") iconName = "search";
      else if (route.name === "profile") iconName = "person";

      return (
        <Ionicons
          name={iconName}
          size={size}
          color={color}
        />
      );
    },

    tabBarStyle: {
      height: 65,
      paddingBottom: 10,
      paddingTop: 5,
    },
  })}
> 
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    

      {/* 🔥 IMPORTANT: Cart screen connect */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
        }}
      />

<Tabs.Screen name="search" options={{ title: "Search" }} />
<Tabs.Screen name="profile" options={{ title: "Profile" }} />

<Tabs.Screen
  name="category"
  options={{
    href: null,
  }}
/>

{/* 👇 hidden screen */}
<Tabs.Screen
  name="product-detail"
  options={{
    href: null,
  }}
/>
    </Tabs>
  );
}