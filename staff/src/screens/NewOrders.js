import React, { useEffect, useState } from "react";
import {
View,
Text,
TouchableOpacity,
FlatList,
ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://api.harzo.in/api/orders";

export default function NewOrders({
goDetails,
goBack,
selectedDay
}) {

const [orders,setOrders]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{

loadOrders();

const interval=setInterval(()=>{
loadOrders();
},1000);

return()=>clearInterval(interval);

},[]);


const loadOrders=async()=>{

try{

const token = await AsyncStorage.getItem("staffToken");

const response = await fetch(API, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

console.log("STATUS:", response.status);

const data = await response.json();

console.log("DATA:", data);

setOrders(data);

}
catch(err){

console.log(err);

}

setLoading(false);

};


const filteredOrders=orders.filter(order=>{

const orderDate=new Date(order.createdAt);

const today=new Date();

today.setHours(0,0,0,0);

orderDate.setHours(0,0,0,0);

const diff=Math.floor(
(today-orderDate)/(1000*60*60*24)
);

if(selectedDay==="Today")
return diff===0;

if(selectedDay==="Yesterday")
return diff===1;

if(selectedDay==="Day Before")
return diff===2;

if(selectedDay==="3 Days")
return diff===3;

if(selectedDay==="4 Days")
return diff===4;

if(selectedDay==="5 Days")
return diff===5;

if(selectedDay==="6 Days")
return diff===6;

return true;

});


return(

<View
style={{
flex:1,
padding:20,
backgroundColor:"#f5f5f5"
}}
>

<TouchableOpacity
onPress={goBack}
style={{
marginTop:40,
marginBottom:20
}}
>

<Text
style={{
fontSize:22,
fontWeight:"bold"
}}
>
← Back
</Text>

</TouchableOpacity>

<Text
style={{
fontSize:35,
fontWeight:"bold"
}}
>
{selectedDay || "New Orders"}
</Text>

{loading ? (

<ActivityIndicator
size="large"
style={{
marginTop:50
}}
/>

) : (

<FlatList
data={filteredOrders}
keyExtractor={(item)=>item._id}

renderItem={({item})=>(

<TouchableOpacity
onPress={()=>goDetails(item)}
style={{
backgroundColor:"#fff",
marginTop:15,
borderRadius:15,
padding:18,
elevation:5
}}
>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:10
}}
>

<Text
numberOfLines={1}
style={{
fontSize:16,
fontWeight:"400",
flex:1,
marginRight:10,
color:"#222"
}}
>
{item.user?.name || "No Name"}
</Text>

<View
style={{
backgroundColor:"#ff9800",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:20
}}
>

<Text
style={{
color:"#fff",
fontWeight:"bold"
}}
>
{item.status}
</Text>

</View>

</View>

<Text style={{marginTop:10,color:"#666"}}>
📦 Order ID : {item.orderId}
</Text>

<Text style={{marginTop:5,color:"#666"}}>
🆔 User ID : {item.userId}
</Text>

<Text style={{marginTop:5,color:"#666"}}>
📍 {item.address?.fullAddress || "No Address"}
</Text>

<Text style={{marginTop:5,color:"#666"}}>
📅 {new Date(item.createdAt)
.toLocaleString()}
</Text>

</TouchableOpacity>

)}
/>

)}

</View>

);

}