import React, { useEffect, useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AddressScreen() {

const [user, setUser] = useState({
name: "",
phone: "",
address: "",
city: "",
pincode: "",
});

// ✅ AUTO LOAD PROFILE DATA
useEffect(() => {
loadUser();
}, []);

const loadUser = async () => {
try {

const savedUser = await AsyncStorage.getItem("user");  

  if (savedUser) {  

    const parsedUser = JSON.parse(savedUser);  

    // ✅ PROFILE COMPLETE HAI  
   if (

parsedUser.name &&
parsedUser.phone &&
parsedUser.address &&
parsedUser.city &&
parsedUser.pincode
) {

console.log("PROFILE FOUND");

router.replace("/payment");

return;
}

// ❌ PROFILE INCOMPLETE  
    setUser(parsedUser);  
  }  

} catch (error) {  
  console.log(error);  
}

};

const placeOrder = async () => {

  try {

    const response = await fetch(
      "https://api.harzo.in/api/delivery"
    );

    const areas = await response.json();

    // ✅ USER ADDRESS
    const fullAddress =
      `${user.address} ${user.city}`
        .toLowerCase();

    // ✅ MATCH AREA
    const matchedArea = areas.find(
      (item) =>
        fullAddress.includes(
          item.area.toLowerCase()
        )
    );

    // ❌ NOT AVAILABLE
    if (!matchedArea) {

      Alert.alert(
        "Delivery Not Available",
        "Sorry, we do not deliver in your area."
      );

      return;
    }

    // ✅ SAVE USER
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // ✅ GO PAYMENT
    router.push("/payment");

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Error",
      "Something went wrong"
    );
  }
};

return (
<View style={styles.container}>

<Text style={styles.heading}>  
    Delivery Address  
  </Text>  

  <TextInput  
    placeholder="Name"  
    value={user.name}  
    onChangeText={(text) =>  
      setUser({ ...user, name: text })  
    }  
    style={styles.input}  
  />  

  <TextInput  
    placeholder="Phone"  
    value={user.phone}  
    onChangeText={(text) =>  
      setUser({ ...user, phone: text })  
    }  
    style={styles.input}  
  />  

  <TextInput  
    placeholder="Address"  
    value={user.address}  
    onChangeText={(text) =>  
      setUser({ ...user, address: text })  
    }  
    style={styles.input}  
  />  

  <TextInput  
    placeholder="City"  
    value={user.city}  
    onChangeText={(text) =>  
      setUser({ ...user, city: text })  
    }  
    style={styles.input}  
  />  

  <TextInput  
    placeholder="Pincode"  
    value={user.pincode}  
    onChangeText={(text) =>  
      setUser({ ...user, pincode: text })  
    }  
    style={styles.input}  
  />  

  <TouchableOpacity  
    style={styles.button}  
    onPress={placeOrder}  
  >  
    <Text style={styles.buttonText}>  
      Place Order  
    </Text>  
  </TouchableOpacity>  

</View>

);
}

const styles = StyleSheet.create({

container: {
flex: 1,
backgroundColor: "#fff",
padding: 20,
},

heading: {
fontSize: 28,
fontWeight: "bold",
marginBottom: 20,
},

input: {
borderWidth: 1,
borderColor: "#ddd",
borderRadius: 10,
padding: 15,
marginBottom: 15,
},

button: {
backgroundColor: "#facc15",
padding: 15,
borderRadius: 10,
alignItems: "center",
},

buttonText: {
fontWeight: "bold",
fontSize: 16,
},

});