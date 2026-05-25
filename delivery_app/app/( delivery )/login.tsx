// @ts-nocheck

import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";

import { router } from "expo-router";

export default function LoginScreen() {

const [deliveryId, setDeliveryId] = useState("");
const [password, setPassword] = useState("");

const handleLogin = () => {

if (
deliveryId === "DLV001" &&
password === "1234"
) {
Alert.alert("Success","Login Success");

router.replace("/home")

} else {
Alert.alert(
"Error",
"Wrong Delivery ID or Password"
);
}

};

return (

<View style={styles.container}>

<Text style={styles.title}>
Delivery Login
</Text>

<TextInput
placeholder="Delivery ID"
value={deliveryId}
onChangeText={setDeliveryId}
style={styles.input}
/>

<TextInput
placeholder="Password / PIN"
value={password}
onChangeText={setPassword}
secureTextEntry
style={styles.input}
/>

<TouchableOpacity
style={styles.button}
onPress={handleLogin}
>

<Text style={styles.btnText}>
Login
</Text>

</TouchableOpacity>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:20
},

title:{
fontSize:28,
fontWeight:"bold",
marginBottom:30,
textAlign:"center"
},

input:{
borderWidth:1,
borderColor:"#ddd",
padding:14,
borderRadius:10,
marginBottom:15
},

button:{
backgroundColor:"#000",
padding:15,
borderRadius:10
},

btnText:{
color:"#fff",
fontSize:16,
fontWeight:"bold",
textAlign:"center"
}

});