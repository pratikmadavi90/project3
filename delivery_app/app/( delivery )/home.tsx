// @ts-nocheck

import React,{useEffect,useRef,useState} from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Modal,
Animated
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen(){

const [online,setOnline]=useState(true);

const [loading,setLoading]=useState(true);

const [dashboard,setDashboard]=useState(null);

const [showPopup,setShowPopup]=useState(false);

const [seconds,setSeconds]=useState(20);

const [lastOrderId,setLastOrderId]=useState(null);

const scaleAnim=
useRef(new Animated.Value(1)).current;

useEffect(()=>{

loadDashboard();

const interval=
setInterval(()=>{

loadDashboard();

},5000);

return ()=>clearInterval(interval);

},[]);

useEffect(()=>{

if(showPopup){

Animated.loop(

Animated.sequence([

Animated.timing(scaleAnim,{
toValue:1.05,
duration:500,
useNativeDriver:true
}),

Animated.timing(scaleAnim,{
toValue:1,
duration:500,
useNativeDriver:true
})

])

).start();

}

},[showPopup]);

useEffect(()=>{

let timer;

if(showPopup && seconds>0){

timer=setTimeout(()=>{

setSeconds(seconds-1);

},1000);

}

if(seconds===0){

setShowPopup(false);

setSeconds(20);

}

return ()=>clearTimeout(timer);

},[showPopup,seconds]);

const loadDashboard=async()=>{

try{

const savedUser =
await AsyncStorage.getItem(
"deliveryBoy"
);

const user =
JSON.parse(savedUser);

const data=
await fetch(

`https://api.harzo.in/api/orders/delivery-dashboard?deliveryBoyId=${user.deliveryId || user.id}`

);

const json=
await data.json();


if(json.success){

setDashboard(json);

if(
json.liveOrder &&
["Pending"].includes(
json.liveOrder.status
)
){

if(
json.liveOrder._id &&
lastOrderId!==json.liveOrder._id
){

setShowPopup(true);

setSeconds(20);

setLastOrderId(json.liveOrder._id);

}

}else{

setShowPopup(false);

}

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

const acceptOrder = async(order)=>{

try{

await fetch(
`https://api.harzo.in/api/orders/${order._id}/status`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status:"Accepted"
})
}
);

loadDashboard();

router.push({
pathname:"/order-details",
params:{
id:order._id,
orderId:order.orderId,
customer:order?.user?.name,
distance:order?.address?.city,
amount:order?.finalAmount,
landmark:order?.address?.fullAddress,
phone:order?.user?.phone,
status:"Accepted"
}
});

}catch(err){

console.log(err);

}

};

const rejectOrder=async()=>{

try{

await fetch(
`https://api.harzo.in/api/orders/reject/${dashboard?.liveOrder?._id}`,
{
method:"PUT"
}
);

setShowPopup(false);

loadDashboard();

}catch(err){

console.log(err);

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

<SafeAreaView style={{flex:1}}>

{/* POPUP */}

<Modal
visible={showPopup}
transparent={true}
animationType="slide"
>

<View style={styles.popupContainer}>

<Animated.View
style={[
styles.popupBox,
{
transform:[
{scale:scaleAnim}
]
}
]}
>

<Text style={styles.popupTitle}>
🚨 New Order
</Text>

<Text style={styles.popupText}>
📦 {dashboard?.liveOrder?.orderId}
</Text>

<Text style={styles.popupText}>
👤 {dashboard?.liveOrder?.user?.name}
</Text>

<Text style={styles.popupText}>
📍 {dashboard?.liveOrder?.address?.city}
</Text>

<Text style={styles.popupText}>
🏠 {dashboard?.liveOrder?.address?.fullAddress}
</Text>

<Text style={styles.popupText}>
📞 {dashboard?.liveOrder?.user?.phone}
</Text>

<Text style={styles.popupText}>
💵 ₹{dashboard?.liveOrder?.totalAmount}
</Text>

<Text style={styles.popupText}>
🚚 {dashboard?.liveOrder?.status}
</Text>

<View style={styles.timerBox}>

<Text style={styles.timerText}>
⏰ {seconds}s
</Text>

</View>

<View style={styles.popupBtnRow}>

<TouchableOpacity
style={styles.rejectBtn}
onPress={rejectOrder}
>

<Text style={styles.popupBtnText}>
Reject
</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.acceptPopupBtn}
onPress={() => acceptOrder(dashboard?.liveOrder)}
>

<Text style={styles.popupBtnText}>
Accept
</Text>

</TouchableOpacity>



</View>

</Animated.View>

</View>

</Modal>

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

<Text>TEST ICON</Text>

<Ionicons
  name="person"
  size={60}
  color="red"
/>

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
₹{(dashboard?.deliveredOrders || 0) * 20}
</Text>

<Text>
💰 Earnings
</Text>

</View>

</View>

<Text style={styles.heading}>
Current Order
</Text>

{dashboard?.orders?.length > 0 ? (

dashboard.orders
.filter(
order =>
["Pending","Accepted","Picked Up","Out for Delivery"]
.includes(order.status)
)
.map((order,index)=>(

<View
key={order._id}
style={[
styles.orderCard,
{marginBottom:15}
]}
>

<Text style={styles.orderText}>
📦 Order ID: {order.orderId}
</Text>

<Text style={styles.orderText}>
👤 Customer: {order?.user?.name}
</Text>

<Text style={styles.orderText}>
📍 City: {order?.address?.city}
</Text>

<Text style={styles.orderText}>
🏠 Address: {order?.address?.fullAddress || "N/A"}
</Text>

<Text style={styles.orderText}>
    💵 Amount: ₹{order?.totalAmount}
</Text>

<Text style={styles.orderText}>
🚚 Status: {order?.status}
</Text>

<TouchableOpacity
style={styles.acceptBtn}
onPress={async()=>{

try{

await fetch(
`https://api.harzo.in/api/orders/accept/${order._id}`,
{
method:"PUT"
}
);

loadDashboard();

console.log("ORDER =", order);
console.log("AMOUNT =", order?.totalAmount);

router.push({
pathname:"/order-details",
params:{
id:order._id,
orderId:order.orderId,
customer:order?.user?.name,
distance:order?.address?.city,
amount:order?.totalAmount,
landmark:order?.address?.fullAddress,
phone:order?.user?.phone,
status:"Accepted"
}
});

}catch(err){

console.log(err);

}

}}
>

<Text style={styles.acceptText}>
Accept Order
</Text>

</TouchableOpacity>

</View>

))

) : (

<View style={styles.orderCard}>

<Text style={styles.orderText}>
No Orders Found
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

topHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginTop:5,
marginBottom:15,
},

title:{
fontSize:24,
fontWeight:"bold",
width:180,
},

subtitle:{
fontSize:14,
color:"gray",
marginTop:3,
},

statusBtn:{
paddingHorizontal:16,
height:38,
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
height:100,
borderRadius:18,
marginBottom:12,
justifyContent:"center",
alignItems:"center",
elevation:3,
},

number:{
fontSize:26,
fontWeight:"bold",
marginBottom:4,
},

heading:{
fontSize:22,
fontWeight:"bold",
marginTop:5,
marginBottom:10,
},

orderCard:{
backgroundColor:"#fff",
padding:15,
borderRadius:18,
elevation:3,
},

orderText:{
fontSize:15,
marginBottom:8,
},

acceptBtn:{
backgroundColor:"#2563eb",
padding:15,
borderRadius:14,
marginTop:12,
marginBottom:10,
},

acceptText:{
color:"#fff",
fontSize:18,
fontWeight:"bold",
textAlign:"center",
},

popupContainer:{
flex:1,
backgroundColor:"rgba(0,0,0,0.5)",
justifyContent:"center",
alignItems:"center",
padding:20,
},

popupBox:{
backgroundColor:"#fff",
width:"85%",
borderRadius:22,
padding:16,
},

popupTitle:{
fontSize:24,
fontWeight:"bold",
marginBottom:15,
textAlign:"center",
},

popupText:{
fontSize:15,
marginBottom:8,
},

timerBox:{
backgroundColor:"#fee2e2",
padding:10,
borderRadius:12,
marginTop:10,
alignItems:"center",
},

timerText:{
fontSize:20,
fontWeight:"bold",
color:"#dc2626",
},

popupBtnRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:20,
},

rejectBtn:{
flex:1,
backgroundColor:"#ef4444",
paddingVertical:10,
borderRadius:12,
marginRight:8,
},

acceptPopupBtn:{
flex:1,
backgroundColor:"#22c55e",
paddingVertical:10,
borderRadius:12,
},

popupBtnText:{
color:"#fff",
fontSize:14,
fontWeight:"bold",
textAlign:"center",
},

});