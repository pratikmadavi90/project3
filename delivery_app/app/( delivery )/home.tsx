// @ts-nocheck

import React,{useEffect,useState} from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen(){

const [online,setOnline]=useState(true);

const [loading,setLoading]=useState(true);

const [dashboard,setDashboard]=useState(null);

useEffect(()=>{

loadDashboard();

const interval=
setInterval(()=>{

loadDashboard();

},5000);

return ()=>clearInterval(interval);

},[]);

const loadDashboard=async()=>{

try{

const data=
await fetch(
"https://api.harzo.in/api/orders/delivery-dashboard"
);

const json=
await data.json();

if(json.success){

setDashboard(json);

}

}catch(err){

console.log(err);

}finally{

setLoading(false);

}

};

const toggleStatus=()=>{
setOnline(!online);
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

<SafeAreaView style={{flex:1}}>

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{
paddingBottom:90,
}}
>

<View style={styles.topHeader}>

<View>

<Text style={styles.title}>
Hi, Delivery Partner 👋
</Text>

<Text style={styles.subtitle}>
Welcome to Harzo Delivery
</Text>

</View>

<TouchableOpacity
style={[
styles.statusBtn,
{
backgroundColor:
online?"#16a34a":"#dc2626"
}
]}
onPress={toggleStatus}
>

<Text style={styles.statusText}>
{online?"Online":"Offline"}
</Text>

</TouchableOpacity>

</View>

<View style={styles.cardContainer}>

<View style={[
styles.card,
{
backgroundColor:"#dbeafe"
}
]}>

<Text style={styles.number}>
{dashboard?.totalOrders || 0}
</Text>

<Text>
📦 Orders
</Text>

</View>

<View style={[
styles.card,
{
backgroundColor:"#dcfce7"
}
]}>

<Text style={styles.number}>
{dashboard?.deliveredOrders || 0}
</Text>

<Text>
✅ Delivered
</Text>

</View>

<View style={[
styles.card,
{
backgroundColor:"#fef3c7"
}
]}>

<Text style={styles.number}>
{dashboard?.pendingOrders || 0}
</Text>

<Text>
⏳ Pending
</Text>

</View>

<View style={[
styles.card,
{
backgroundColor:"#f3e8ff"
}
]}>

<Text style={styles.number}>
₹450
</Text>

<Text>
💰 Earnings
</Text>

</View>

</View>

<Text style={styles.heading}>
Current Order
</Text>

<View style={styles.orderCard}>

<Text style={styles.orderText}>
📦 Order ID:
{" "}
{dashboard?.liveOrder?.orderId || "No Order"}
</Text>

<Text style={styles.orderText}>
👤 Customer:
{" "}
{dashboard?.liveOrder?.user?.name || "-"}
</Text>

<Text style={styles.orderText}>
📍 City:
{" "}
{dashboard?.liveOrder?.address?.city || "-"}
</Text>

<Text style={styles.orderText}>
💵 Amount:
₹{dashboard?.liveOrder?.finalAmount || 0}
</Text>

<TouchableOpacity
style={styles.acceptBtn}

onPress={()=>
router.push({
pathname:"/order-details",
params:{
orderId:
dashboard?.liveOrder?.orderId,

customer:
dashboard?.liveOrder?.user?.name,

distance:
dashboard?.liveOrder?.address?.city,

amount:
dashboard?.liveOrder?.finalAmount
}
})
}
>

<Text style={styles.acceptText}>
Accept Order
</Text>

</TouchableOpacity>

</View>

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

topHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginTop:5,
marginBottom:15,
},

title:{
fontSize:18,
fontWeight:"bold",
width:180,
},

subtitle:{
fontSize:13,
color:"gray",
},

statusBtn:{
paddingHorizontal:12,
height:35,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
},

statusText:{
color:"#fff",
fontSize:14,
fontWeight:"bold",
},

cardContainer:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
},

card:{
width:"48%",
height:85,
borderRadius:15,
marginBottom:10,
justifyContent:"center",
alignItems:"center",
},

number:{
fontSize:22,
fontWeight:"bold",
},

heading:{
fontSize:18,
fontWeight:"bold",
marginTop:5,
marginBottom:8,
},

orderCard:{
backgroundColor:"#fff",
padding:12,
borderRadius:15,
},

orderText:{
fontSize:14,
marginBottom:6,
},

acceptBtn:{
backgroundColor:"#2563eb",
padding:12,
borderRadius:12,
marginTop:12,
marginBottom:10,
},

acceptText:{
color:"#fff",
fontSize:16,
fontWeight:"bold",
textAlign:"center",
}

});