import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function Login() {
const router = useRouter();
 const [mobile, setMobile] = useState(""); 

 

 return (
  <>


    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 30,
        }}
      >
        {/* Logo */}
<Text
  style={{
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00B7A8",
    letterSpacing: 2,
  }}
>
  HARZO
</Text>

        <Text
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: 16,
            marginTop: 10,
          }}
        >
          Welcome Back
        </Text>

        {/* Mobile Number */}
        <Text
          style={{
            marginTop: 50,
            marginBottom: 8,
            color: "#444",
            fontWeight: "600",
          }}
        >
          Mobile Number
        </Text>

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    backgroundColor: "#F9FAFB",
    height: 55,
    paddingHorizontal: 15,
  }}
>
  <Text
    style={{
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    }}
  >
    +91
  </Text>

  <View
    style={{
      width: 1,
      height: 25,
      backgroundColor: "#DDD",
      marginHorizontal: 10,
    }}
  />

<TextInput
  placeholder="Enter Mobile Number"
  keyboardType="phone-pad"
  maxLength={10}
  value={mobile}
  onChangeText={setMobile}
  style={{
    flex: 1,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: "transparent",
  }}
/>
</View>



{/* Continue Button */}
<TouchableOpacity
  onPress={() => {
    console.log("Continue Clicked");
  }}
  style={{
    backgroundColor: "#00B7A8",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,

    shadowColor: "#00B7A8",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }}
>
  <Text
    style={{
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    }}
  >
    Continue
  </Text>
</TouchableOpacity>

{/* Skip Button */}
<TouchableOpacity
  onPress={() => router.replace("/(tabs)")}
  style={{
    marginTop: 15,
    alignItems: "center",
  }}
>
  <Text
    style={{
      color: "#00B7A8",
      fontSize: 16,
      fontWeight: "600",
    }}
  >
    Skip For Now
  </Text>
</TouchableOpacity>

<Text
  style={{
    textAlign: "center",
    marginTop: 25,
    color: "#888",
    fontSize: 13,
  }}
>
  By continuing, you agree to our Terms & Privacy Policy
</Text>

</View>
    </SafeAreaView>
  </>
);
}