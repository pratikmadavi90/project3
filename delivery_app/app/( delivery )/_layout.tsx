import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="otp"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="delivery-status"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="order-details"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="map-screen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}