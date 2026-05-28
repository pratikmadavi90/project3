// @ts-nocheck

import React,{useEffect,useState} from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity,
Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {router} from "expo-router";

export default function Profile(){

const [profile,setProfile]=useState(null);

useEffect(()=>{
loadData();
},[]);

const loadData=async()=>{

const data=
await AsyncStorage.getItem(
"deliveryBoy"
);

if(data){

const user=
JSON.parse(data);

setProfile({

name:user.name,
mobile:user.mobile,
id:user.deliveryId,
vehicle:user.vehicle || user.vehicleType

});

}

};

const handleLogout=async()=>{

try{

const data=
await AsyncStorage.getItem(
"deliveryBoy"
);

const user=
JSON.parse(data);

await fetch(

`https://api.harzo.in/api/delivery/logout/${user.id}`,

{
method:"PUT"
}

);



await AsyncStorage.removeItem(
"deliveryBoy"
);

Alert.alert(
"Success",
"Logout Successful"
);

router.replace("/login");

}catch(error){

console.log(error);

}

};

return(

<View style={styles.container}>

<Text style={styles.heading}>
My Profile
</Text>

<View style={styles.card}>

<Text style={styles.text}>
👤 Name: {profile?.name}
</Text>

<Text style={styles.text}>
📞 Mobile: {profile?.mobile}
</Text>

<Text style={styles.text}>
🆔 ID: {profile?.id}
</Text>

<Text style={styles.text}>
🏍️ Vehicle: {profile?.vehicle}
</Text>

<TouchableOpacity
style={styles.logoutBtn}
onPress={handleLogout}
>

<Text style={styles.logoutText}>
Logout
</Text>

</TouchableOpacity>

</View>

</View>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#f3f4f6"
},

heading:{
fontSize:28,
fontWeight:"bold",
marginBottom:20,
color:"#111827"
},

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:18,
elevation:5
},

text:{
fontSize:18,
marginBottom:15,
color:"#374151"
},

logoutBtn:{
marginTop:15,
backgroundColor:"#ef4444",
paddingVertical:10,
borderRadius:10,
alignItems:"center"
},

logoutText:{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}

});