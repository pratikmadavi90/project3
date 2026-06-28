// @ts-nocheck

import React,{useState} from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
KeyboardAvoidingView,
ScrollView
} from "react-native";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";


export default function LoginScreen(){

const [deliveryId,setDeliveryId]=useState("");
const [password,setPassword]=useState("");

const handleLogin=async()=>{

try{

const res=await fetch(
"https://api.harzo.in/api/delivery-boy/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
deliveryId,
password
})
}
);

const data=await res.json();

if(data.success){

await AsyncStorage.setItem(
"deliveryBoy",
JSON.stringify(data.deliveryBoy)
);

await AsyncStorage.setItem(
  "deliveryToken",
  data.token
);

router.replace("/home");

}else{
alert(
data.message ||
"Wrong Delivery ID or Password"
);

}

}catch{

alert("Server Error");

}

};

return(

<KeyboardAvoidingView
style={{flex:1}}
behavior="height"
>

<ScrollView
contentContainerStyle={{
flexGrow:1
}}
keyboardShouldPersistTaps="handled"
>

<View style={styles.container}>

<View style={styles.logoBox}>

<Text style={styles.harzo}>
HARZO
</Text>

<Text style={styles.mh}>
MH34
</Text>

<Text style={styles.sars}>
Sarswathi
</Text>

</View>

<View style={styles.card}>

<Text style={styles.loginText}>
Delivery Login
</Text>

<TextInput
placeholder="Delivery ID"
placeholderTextColor="#888"
value={deliveryId}
onChangeText={setDeliveryId}
style={styles.input}
/>

<TextInput
placeholder="Password / PIN"
placeholderTextColor="#888"
secureTextEntry
value={password}
onChangeText={setPassword}
style={styles.input}
/>

<TouchableOpacity
style={styles.button}
onPress={handleLogin}
>

<Text style={styles.btnText}>
LOGIN
</Text>

</TouchableOpacity>

</View>

</View>

</ScrollView>

</KeyboardAvoidingView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#ffffff",
justifyContent:"center",
padding:24
},

logoBox:{
alignItems:"center",
marginBottom:45
},

harzo:{
fontSize:42,
fontWeight:"bold",
color:"#16a34a",
letterSpacing:3
},

mh:{
fontSize:18,
color:"#111827",
marginTop:6,
fontWeight:"700"
},

sars:{
fontSize:15,
color:"#6b7280",
marginTop:4
},

card:{
backgroundColor:"#ffffff",
padding:24,
borderRadius:24,
borderWidth:1,
borderColor:"#e5e7eb",
elevation:4
},

loginText:{
fontSize:28,
fontWeight:"bold",
color:"#111827",
marginBottom:25,
textAlign:"center"
},

input:{
backgroundColor:"#f9fafb",
color:"#111827",
padding:16,
borderRadius:14,
marginBottom:15,
borderWidth:1,
borderColor:"#d1d5db",
fontSize:16
},

button:{
backgroundColor:"#16a34a",
padding:18,
borderRadius:14,
marginTop:10
},

btnText:{
textAlign:"center",
fontWeight:"bold",
fontSize:17,
color:"#ffffff"
}

});