import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const API = "https://api.harzo.in/api/users";

export default function Profile() {

  const router = useRouter();

const [user, setUser] = useState({
userId: "",
name: "",
phone: "",
email: "",
address: "",
village: "",
landmark: "",
city: "",
pincode: "",
});

const [villages, setVillages] = useState<any[]>([]);
const [showVillage, setShowVillage] = useState(false);

  // 📥 LOAD USER DATA
  useEffect(() => {

    const loadData = async () => {

      try {

        const savedUser =
          await AsyncStorage.getItem(
            "user"
          );

        if (savedUser) {

const parsedUser =
  JSON.parse(savedUser);

console.log(
  "ASYNC USER:",
  JSON.stringify(
    parsedUser,
    null,
    2
  )
);

setUser({
  ...parsedUser
});
        }

      } catch (err) {

        console.log(err);

        Alert.alert(
          "Error",
          "Data load nahi hua"
        );
      }
    };

loadData();

const loadVillages = async () => {

try {

const res = await fetch(
"https://api.harzo.in/api/delivery/all"
);

const data = await res.json();

console.log("Villages:", data);

setVillages(
  Array.isArray(data)
    ? data
    : data.data || []
);

} catch (err) {

console.log(
"Village Load Error:",
err
);

}

};

loadVillages();

}, []);

 // 💾 UPDATE PROFILE
const updateProfile = async () => {

  try {

    // ADDRESS VALIDATION
 if (!user.village) {

Alert.alert(
"Select Village",
"Please select village"
);

return;
}

if ((user.landmark || "").trim().length < 5) {

Alert.alert(
"Landmark Required",
"Please enter house no / landmark"
);

return;
}

    // LOCATION PERMISSION
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {

      Alert.alert(
        "Permission Required",
        "Location permission required"
      );

      return;
    }

    const serviceEnabled =
      await Location.hasServicesEnabledAsync();

    if (!serviceEnabled) {

      Alert.alert(
        "Location Off",
        "Please turn on GPS"
      );

      return;
    }

    // CURRENT LOCATION
    const currentLocation =
  await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

    if (!currentLocation) {

      Alert.alert(
        "Location Error",
        "Move outside and try again"
      );

      return;
    }

    const latitude =
      currentLocation.coords.latitude;

    const longitude =
      currentLocation.coords.longitude;

    // CONVERT GPS TO ADDRESS
    const addressData =
      await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

    const liveArea =
      (
        addressData[0]?.city ||
        addressData[0]?.district ||
        addressData[0]?.subregion ||
        addressData[0]?.name ||
        ""
      )
      .toLowerCase()
      .trim();

    console.log(
      "FULL LOCATION:",
      addressData[0]
    );

    console.log(
      "LIVE AREA:",
      liveArea
    );

    // GET ADMIN DELIVERY AREAS
    const response =
      await fetch(
        "https://api.harzo.in/api/delivery/all"
      );

    const areasResponse =
      await response.json();

    const areas =
      areasResponse.data ||
      areasResponse;

    
// MATCH LIVE AREA WITH SELECTED VILLAGE

const selectedVillage =
(user.village || "")
.toLowerCase()
.trim();

if (selectedVillage !== liveArea) {

Alert.alert(
"Delivery Not Available",
`You are in ${liveArea.charAt(0).toUpperCase() + liveArea.slice(1)} but selected ${user.village}`
);

return;

}

const matchedArea =
areas.find((item:any)=>{

const adminVillage =
(
item.area ||
item.name ||
""
)
.toLowerCase()
.trim();

return adminVillage === selectedVillage;

});

    // DELIVERY CHECK
if (!matchedArea) {

Alert.alert(
"Delivery Not Available",
`No delivery in ${selectedVillage}`
);

return;

}

    // EMAIL CHECK
    if (!user.email) {

      Alert.alert(
        "Error",
        "Email missing"
      );

      return;
    }

    // FINAL USER DATA
 const finalUser = {

...user,

address:
`${user.village}, ${user.landmark}`,

userId:
user?.userId ||
"USR" + Date.now()

};

    // UPDATE API
    const res =
      await fetch(
        `${API}/update`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              finalUser
            )
        }
      );

    const data =
      await res.json();

    console.log(
      "UPDATE RESPONSE:",
      data
    );

    // SAVE LOCAL
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(
        finalUser
      )
    );

    setUser(
      finalUser
    );

    Alert.alert(
      "Success",
      "Profile updated"
    );

  } catch (err) {

    console.log(
      "UPDATE ERROR:",
      err
    );

    Alert.alert(
      "Error",
      "Update failed"
    );

  }

}; 

  // 🔥 LOGOUT
  const handleLogout = async () => {

    try {

      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Logout",

            onPress: async () => {

              try {

                await AsyncStorage.removeItem(
                  "token"
                );

                await AsyncStorage.removeItem(
                  "user"
                );

setUser({
userId: "",
name: "",
phone: "",
email: "",
address: "",
village: "",
landmark: "",
city: "",
pincode: "",
});
              router.replace("/");

              } catch (error) {

                console.log(
                  "Logout Error:",
                  error
                );
              }
            },
          },
        ]
      );

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.profileHeader}>

        <View style={styles.profileCircle}>
          <Text style={styles.profileLetter}>
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "H"}
          </Text>
        </View>

        <Text style={styles.profileTitle}>
          Profile
        </Text>

        <Text style={styles.profileSubtitle}>
          Profile + Delivery Address
        </Text>

      </View>

      {/* NAME */}
      <TextInput
        placeholder="Name"
        placeholderTextColor="#666"
        value={user.name}
        autoCapitalize="words"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            name: text,
          })
        }
        style={styles.input}
      />

      {/* PHONE */}
      <TextInput
        placeholder="Phone"
        placeholderTextColor="#666"
        value={user.phone}
        keyboardType="phone-pad"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            phone: text,
          })
        }
        style={styles.input}
      />

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={user.email}
        autoCapitalize="none"
        keyboardType="email-address"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            email: text,
          })
        }
        style={styles.input}
      />

      {/* ADDRESS */}
{/* VILLAGE */}
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowVillage(true)}
>
<Text
  style={{
    fontSize:16,
    color:"#111111",
    fontWeight:"500"
  }}
>
  {user.village || "Select Village"}
</Text>
</TouchableOpacity>

<Modal
  visible={showVillage}
  transparent
  animationType="slide"
>
  <View
    style={{
      flex:1,
      justifyContent:"center",
      backgroundColor:"rgba(0,0,0,0.5)"
    }}
  >
    <View
      style={{
        backgroundColor:"#fff",
        margin:20,
        borderRadius:10,
        padding:20,
        maxHeight:400
      }}
    >
     <FlatList
  data={villages}
  keyExtractor={(item:any)=>item._id}
  renderItem={({item}:any)=>(
          <TouchableOpacity
            onPress={()=>{
              setUser({
                ...user,
                village:item.name,
                city:item.name,
                pincode:item.pincode || ""
              });

              setShowVillage(false);
            }}
          >
            <Text style={{padding:15,fontSize:18}}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>


{/* LANDMARK */}
<TextInput
placeholder="House No / Landmark"
placeholderTextColor="#666"
value={user.landmark}
selectionColor="#22c55e"
onChangeText={(text)=>
setUser({
...user,
landmark:text
})
}
style={styles.addressInput}
/>



      {/* PINCODE */}
      <TextInput
        placeholder="Pincode"
        placeholderTextColor="#666"
        value={user.pincode}
        keyboardType="numeric"
        selectionColor="#22c55e"
        onChangeText={(text) =>
          setUser({
            ...user,
            pincode: text,
          })
        }
        style={styles.input}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.8}
        onPress={updateProfile}
      >
        <Text style={styles.btnText}>
          Save Profile
        </Text>
      </TouchableOpacity>

      {/* ACCOUNT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() =>
            router.push("/orders")
          }
        >
          <Text style={styles.optionText}>
            📦 My Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            💳 Payments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>
            🔔 Notifications
          </Text>
        </TouchableOpacity>

      </View>

      {/* SUPPORT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Support
        </Text>

<TouchableOpacity
style={styles.option}
activeOpacity={0.7}
onPress={()=>
router.push("/help-support")
}
>
<Text style={styles.optionText}>
🛠️ Help & Support
</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.option}
  activeOpacity={0.7}
  onPress={() => router.push("../privacy-policy")}
>
  <Text style={styles.optionText}>
    🔒 Privacy Policy
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.option}
  activeOpacity={0.7}
  onPress={() => router.push("../terms-conditions")}
>
  <Text style={styles.optionText}>
    📜 Terms & Conditions
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.option}
  activeOpacity={0.7}
  onPress={() => router.push("../refund-policy")}
>
  <Text style={styles.optionText}>
    ↩️ Refund Policy
  </Text>
</TouchableOpacity>

<TouchableOpacity
    style={styles.option}
    activeOpacity={0.7}
    onPress={() => {
        router.push("/about")
    }}
>
    <Text style={styles.optionText}>
        ℹ️ About App
    </Text>
</TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[
            styles.option,
            {
              borderBottomWidth: 0,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => {

            console.log(
              "Logout pressed"
            );

            handleLogout();
          }}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: "red",
              },
            ]}
          >
            🚪 Logout
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },

  profileCircle: {
    width: 90,
    height: 90,

    borderRadius: 50,

    backgroundColor: "#22c55e",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // ✅ TEXT FIX FOR ALL DEVICES
  profileLetter: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    includeFontPadding: false,
    textAlign: "center",
  },

  profileTitle: {
    fontSize: 28,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    color: "#111827",
    includeFontPadding: false,
  },

  profileSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
    includeFontPadding: false,
  },

  // ✅ MAIN TEXT FIX
  input: {
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    borderRadius: 12,

    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android"
      ? 12
      : 14,

    marginBottom: 14,

    fontSize: 16,

    color: "#111111",

    fontWeight: "500",

    includeFontPadding: false,

    textAlignVertical: "center",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // ✅ ADDRESS TEXT FIX
  addressInput: {
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingTop: 16,

    minHeight: 90,

    marginBottom: 14,

    fontSize: 16,

    color: "#111111",

    fontWeight: "500",

    includeFontPadding: false,

    textAlignVertical: "top",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  btn: {
    backgroundColor: "#22c55e",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 8,
    marginBottom: 22,

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  btnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: Platform.OS === "android"
      ? "700"
      : "bold",
    includeFontPadding: false,
  },

  section: {
    marginTop: 10,
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 17,
    color: "#64748b",
    marginBottom: 14,
    fontWeight: "700",
    marginLeft: 4,
    includeFontPadding: false,
  },

  option: {
    backgroundColor: "#ffffff",

    paddingVertical: 12,
    paddingHorizontal: 16,

    borderRadius: 14,

    marginBottom: 8,

    elevation: 2,

    borderWidth: 1,
    borderColor: "#f1f5f9",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  // ✅ OPTION TEXT FIX
  optionText: {
    fontSize: 17,
    fontWeight: Platform.OS === "android"
      ? "600"
      : "600",
    color: "#111827",
    includeFontPadding: false,
  },

});