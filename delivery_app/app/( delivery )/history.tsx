// @ts-nocheck

import React,{useEffect,useState} from "react";

import {
View,
Text,
ScrollView,
StyleSheet,
ActivityIndicator,
TouchableOpacity
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen(){

const [loading,setLoading]=useState(true);

const [history,setHistory]=useState(null);

const [expanded,setExpanded]=useState({});

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

const toggleOrders=(index)=>{

setExpanded(prev=>({

...prev,

[index]:!prev[index]

}));

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

{history?.history?.length > 0 ? (

history.history.map((day,index)=>(

<View
key={index}
style={styles.card}
>

<Text style={styles.dateTitle}>
📅 {day.date}
</Text>

<Text style={styles.info}>
📦 Total Orders: {day.totalOrders}
</Text>

<Text style={styles.info}>
💰 Earnings: ₹{day.earning}
</Text>

<TouchableOpacity
style={styles.viewBtn}
onPress={()=>
toggleOrders(index)
}
>

<Text style={styles.viewBtnText}>
{expanded[index]
? "Hide Orders"
: "View Orders"}
</Text>

</TouchableOpacity>

{expanded[index] && (

<View style={styles.orderContainer}>

{day.orders.map((order,i)=>(

<View
key={i}
style={styles.orderBox}
>

<Text style={styles.orderText}>
📦 {order.orderId}
</Text>

<Text style={styles.orderText}>
👤 {order.customer}
</Text>

<Text style={styles.orderText}>
📍 {order.city}
</Text>

<Text style={styles.orderText}>
💵 ₹{order.amount}
</Text>

</View>

))}

</View>

)}

</View>

))

) : (

<View style={styles.card}>

<Text style={styles.info}>
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

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:18,
marginBottom:15,
elevation:3,
},

dateTitle:{
fontSize:20,
fontWeight:"bold",
marginBottom:10,
},

info:{
fontSize:16,
marginBottom:8,
},

viewBtn:{
backgroundColor:"#2563eb",
paddingVertical:10,
borderRadius:10,
marginTop:10,
},

viewBtnText:{
color:"#fff",
fontWeight:"bold",
textAlign:"center",
fontSize:15,
},

orderContainer:{
marginTop:12,
},

orderBox:{
backgroundColor:"#f8fafc",
padding:12,
borderRadius:12,
marginBottom:10,
},

orderText:{
fontSize:14,
marginBottom:4,
},

});