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
const updateStatus=async(newStatus)=>{

try{

const response=
await fetch(
`https://api.harzo.in/api/orders/${orderId}/status`,
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

const data=
await response.json();

if(data){

setStatus(newStatus);

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
📞  Phone: {phone || "-"}
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

<Text style={styles.timelineTitle}>
Delivery Timeline
</Text>

<View style={styles.timelineBox}>

<Text style={[
styles.timelineText,
status==="Accepted" && styles.activeStep
]}>
✅ Order Accepted
</Text>

<Text style={[
styles.timelineText,
(
status==="Picked Up" ||
status==="Out for Delivery" ||
status==="Delivered"
) && styles.activeStep
]}>
📦 Picked Up
</Text>

<Text style={[
styles.timelineText,
(
status==="Out for Delivery" ||
status==="Delivered"
) && styles.activeStep
]}>
🚚 Out for Delivery
</Text>

<Text style={[
styles.timelineText,
status==="Delivered" &&
styles.activeStep
]}>
🏁 Delivered
</Text>

</View>


{/* BUTTONS */}

{status==="Accepted" && (

<TouchableOpacity
style={styles.pickupBtn}
onPress={()=>
updateStatus("Picked Up")
}
>

<Text style={styles.btnText}>
📦 Picked Up
</Text>

</TouchableOpacity>

)}


{status==="Picked Up" && (

<TouchableOpacity
style={styles.deliveryBtn}
onPress={()=>
updateStatus("Out for Delivery")
}
>

<Text style={styles.btnText}>
🚚 Start Delivery
</Text>

</TouchableOpacity>

)}


{status==="Out for Delivery" && (

<TouchableOpacity
style={styles.completeBtn}
onPress={()=>
updateStatus("Delivered")
}
>

<Text style={styles.btnText}>
✅ Mark as Delivered
</Text>

</TouchableOpacity>

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
fontSize:28,
fontWeight:"bold",
marginBottom:20,
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:20,
elevation:4,
},

text:{
fontSize:17,
marginBottom:14,
},

statusBox:{
marginTop:10,
padding:14,
backgroundColor:"#eff6ff",
borderRadius:14,
},

statusTitle:{
fontSize:16,
fontWeight:"bold",
marginBottom:6,
},

status:{
fontSize:20,
fontWeight:"bold",
color:"#2563eb",
},

timelineTitle:{
fontSize:22,
fontWeight:"bold",
marginTop:25,
marginBottom:15,
},

timelineBox:{
backgroundColor:"#fff",
padding:18,
borderRadius:18,
elevation:3,
},

timelineText:{
fontSize:17,
marginBottom:14,
color:"#9ca3af",
fontWeight:"600",
},

activeStep:{
color:"#16a34a",
},

pickupBtn:{
backgroundColor:"#f59e0b",
padding:16,
borderRadius:14,
marginTop:25,
},

deliveryBtn:{
backgroundColor:"#2563eb",
padding:16,
borderRadius:14,
marginTop:25,
},

completeBtn:{
backgroundColor:"#16a34a",
padding:16,
borderRadius:14,
marginTop:25,
},

btnText:{
color:"#fff",
fontSize:18,
fontWeight:"bold",
textAlign:"center",
}

});