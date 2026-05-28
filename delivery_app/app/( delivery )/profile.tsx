// @ts-nocheck

import React,{useEffect,useState} from "react";

import {
View,
Text,
StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
vehicle:user.vehicleType

});

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
fontSize:24,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:15
},

text:{
fontSize:18,
marginBottom:12
}

});