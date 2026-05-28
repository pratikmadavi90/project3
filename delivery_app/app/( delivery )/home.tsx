import React, { useState } from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen(){

const [online,setOnline]=useState(true);

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
onPress={()=>setOnline(!online)}
>

<Text style={styles.statusText}>
{online?"Online":"Offline"}
</Text>

</TouchableOpacity>

</View>

<View style={styles.cardContainer}>

<View style={[styles.card,{backgroundColor:"#dbeafe"}]}>
<Text style={styles.number}>12</Text>
<Text>📦 Orders</Text>
</View>

<View style={[styles.card,{backgroundColor:"#dcfce7"}]}>
<Text style={styles.number}>8</Text>
<Text>✅ Delivered</Text>
</View>

<View style={[styles.card,{backgroundColor:"#fef3c7"}]}>
<Text style={styles.number}>4</Text>
<Text>⏳ Pending</Text>
</View>

<View style={[styles.card,{backgroundColor:"#f3e8ff"}]}>
<Text style={styles.number}>₹450</Text>
<Text>💰 Earnings</Text>
</View>

</View>

<Text style={styles.heading}>
Current Order
</Text>

<View style={styles.orderCard}>

<Text style={styles.orderText}>
📦 Order ID: ORD1001
</Text>

<Text style={styles.orderText}>
👤 Customer: Rahul
</Text>

<Text style={styles.orderText}>
📍 Distance: 2.5 km
</Text>

<Text style={styles.orderText}>
💵 Amount: ₹350
</Text>

<TouchableOpacity
style={styles.acceptBtn}

onPress={()=>
router.push({
pathname:"/order-details",
params:{
orderId:"ORD1001",
customer:"Rahul",
distance:"2.5 km",
amount:"350"
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