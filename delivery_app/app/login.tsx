// @ts-nocheck

import React,{useState} from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet
} from "react-native";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#081120",
justifyContent:"center",
padding:20
},

logoBox:{
alignItems:"center",
marginBottom:40
},

harzo:{
fontSize:42,
fontWeight:"bold",
color:"#00ff88",
letterSpacing:4
},

mh:{
fontSize:18,
color:"#fff",
marginTop:5,
fontWeight:"700"
},

sars:{
fontSize:16,
color:"#aaa",
marginTop:5
},

card:{
backgroundColor:"#12233d",
padding:25,
borderRadius:25
},

loginText:{
fontSize:24,
fontWeight:"bold",
color:"#fff",
marginBottom:25,
textAlign:"center"
},

input:{
backgroundColor:"#0a1730",
color:"#fff",
padding:16,
borderRadius:14,
marginBottom:15
},

button:{
backgroundColor:"#00ff88",
padding:18,
borderRadius:14,
marginTop:10
},

btnText:{
textAlign:"center",
fontWeight:"bold",
fontSize:16,
color:"#000"
}

});