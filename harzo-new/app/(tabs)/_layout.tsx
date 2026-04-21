import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0C8A7B',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'Category') iconName = 'grid';
          else if (route.name === 'cart') iconName = 'cart';
          else if (route.name === 'search') iconName = 'search';
          else if (route.name === 'profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="Category" options={{ title: 'Category' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

      {/* 👇 hidden screen (NO tab button) */}
      <Tabs.Screen
      name="product-detail"
      options={{
       href: null, // 👈 use THIS instead
      }}
      />
     </Tabs>
   );
  }