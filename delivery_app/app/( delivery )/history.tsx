// @ts-nocheck

import React,{useEffect,useState} from "react";

import {
View,
Text,
ScrollView,
StyleSheet,
ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen(){

const [loading,setLoading]=
useState(true);

const [history,setHistory]=
useState(null);

useEffect(()=>{

loadHistory();

},[]);

const loadHistory=async()=>{

try{

const savedUser =
await AsyncStorage.getItem(
"deliveryBoy"
);

const user =
JSON.parse(savedUser);

const response =
await fetch(

`https://api.harzo.in/api/orders/delivery-history/${user.deliveryId || user.id}`

);

const data =
await response.json();

setHistory(data);

}catch(err){

console.log(err);

}finally{

setLoading(false);

}

};

if(loading){

return(

<View style={{
flex:1,
justifyContent:"center",
alignItems:"center"
}}>

<ActivityIndicator
size="large"
color="#2563eb"
/>

</View>

);

}

return(

<SafeAreaView style={styles.container}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={{
paddingBottom:40
}}
>

<Text style={styles.heading}>
📜 Delivery History
</Text>

<View style={styles.summaryCard}>

<Text style={styles.summaryTitle}>
Total Delivered Orders
</Text>

<Text style={styles.summaryNumber}>
{history?.totalDelivered || 0}
</Text>

</View>

{history?.orders?.length > 0 ? (

history.orders.map((order)=>(

<View
key={order._id}
style={styles.card}
>

<Text style={styles.text}>
📦 {order.orderId}
</Text>

<Text style={styles.text}>
👤 {order?.user?.name}
</Text>

<Text style={styles.text}>
📍 {order?.address?.city}
</Text>

<Text style={styles.text}>
💵 ₹{order?.totalAmount}
</Text>

<Text style={styles.text}>
📅 {
order?.deliveredAt
? new Date(
order.deliveredAt
).toLocaleDateString()
: "-"
}
</Text>

</View>

))

) : (

<View style={styles.card}>

<Text style={styles.text}>
No Delivered Orders Found
</Text>

</View>

)}

</ScrollView>

</SafeAreaView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f3f4f6",
padding:15,
},

heading:{
fontSize:24,
fontWeight:"bold",
marginBottom:15,
},

summaryCard:{
backgroundColor:"#dcfce7",
padding:20,
borderRadius:18,
marginBottom:15,
alignItems:"center",
},

summaryTitle:{
fontSize:16,
fontWeight:"600",
},

summaryNumber:{
fontSize:32,
fontWeight:"bold",
marginTop:8,
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:16,
marginBottom:12,
elevation:3,
},

text:{
fontSize:15,
marginBottom:8,
}

});