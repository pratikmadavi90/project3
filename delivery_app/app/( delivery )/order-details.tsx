// @ts-nocheck

import React,{useState} from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity,
Alert,
ScrollView
} from "react-native";

import {
useLocalSearchParams,
router
} from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetails(){

const {
id,
orderId,
customer,
distance,
amount,
landmark,
phone,
status:initialStatus
}=useLocalSearchParams();

const [status,setStatus]=
useState(
initialStatus || "Accepted"
);



const [showOptions,setShowOptions]=
useState(false);

const updateStatus=async(newStatus)=>{

try{

const response=
await fetch(
`https://api.harzo.in/api/orders/${id}/status`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status:newStatus
})
}
);

const data =
await response.json();

console.log(
"UPDATE RESPONSE =",
data
);

if(data){

setStatus(newStatus);
setShowOptions(false);

Alert.alert(
"Success",
`Order ${newStatus}`
);

if(newStatus==="Delivered"){

Alert.alert(
"Completed",
"Order Delivered Successfully"
);

router.replace("/home");

}

}

}catch(err){

console.log(err);

Alert.alert(
"Error",
"Something went wrong"
);

}

};

return(

<SafeAreaView style={styles.container}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={{
paddingBottom:40
}}
>

<Text style={styles.heading}>
🚚 Order Details
</Text>

<View style={styles.card}>

<Text style={styles.text}>
📦 Order ID: {orderId}
</Text>

<Text style={styles.text}>
👤 Customer: {customer}
</Text>

<Text style={styles.text}>
📍 Area: {distance}
</Text>

<Text style={styles.text}>
💰 Amount: ₹{amount}
</Text>

<Text style={styles.text}>
🏠 Landmark: {landmark || "-"}
</Text>

<Text style={styles.text}>
📞 Phone: {phone || "-"}
</Text>

<View style={styles.statusBox}>

<Text style={styles.statusTitle}>
Current Status
</Text>

<Text style={styles.status}>
🚚 {status}
</Text>

</View>

</View>


<TouchableOpacity
style={styles.statusBtn}
onPress={()=>
setShowOptions(!showOptions)
}
>

<Text style={styles.statusBtnText}>
Update Status
</Text>

</TouchableOpacity>


{showOptions && (

<View style={styles.optionBox}>




<TouchableOpacity
onPress={()=>
updateStatus("Picked Up")
}
>

<Text style={styles.optionText}>
📦 Picked Up
</Text>

</TouchableOpacity>


<TouchableOpacity
onPress={()=>
updateStatus("Out for Delivery")
}
>

<Text style={styles.optionText}>
🚚 Out for Delivery
</Text>

</TouchableOpacity>


<TouchableOpacity
onPress={()=>
updateStatus("Delivered")
}
>

<Text style={styles.optionText}>
🏁 Delivered
</Text>

</TouchableOpacity>

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
padding:12,
},

heading:{
fontSize:22,
fontWeight:"bold",
marginBottom:14,
},

card:{
backgroundColor:"#fff",
padding:14,
borderRadius:16,
elevation:3,
},

text:{
fontSize:15,
marginBottom:10,
color:"#333",
},

statusBox:{
marginTop:8,
padding:10,
backgroundColor:"#eff6ff",
borderRadius:12,
},

statusTitle:{
fontSize:15,
fontWeight:"bold",
marginBottom:4,
},

status:{
fontSize:17,
fontWeight:"bold",
color:"#2563eb",
},

statusBtn:{
backgroundColor:"#2563eb",
padding:14,
borderRadius:12,
marginTop:20,
},

statusBtnText:{
color:"#fff",
fontSize:16,
fontWeight:"bold",
textAlign:"center",
},

optionBox:{
backgroundColor:"#fff",
marginTop:10,
borderRadius:14,
padding:10,
elevation:3,
},

optionText:{
fontSize:15,
paddingVertical:10,
fontWeight:"600",
color:"#333",
},

});