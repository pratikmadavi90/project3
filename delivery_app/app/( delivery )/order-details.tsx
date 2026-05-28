import React from "react";

import {
View,
Text,
StyleSheet,
TouchableOpacity
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
amount
}=useLocalSearchParams();

return(

<SafeAreaView style={styles.container}>

<Text style={styles.heading}>
Order Details
</Text>

<View style={styles.card}>

<Text style={styles.text}>
📦 Order ID: {orderId}
</Text>

<Text style={styles.text}>
👤 Customer: {customer}
</Text>

<Text style={styles.text}>
📍 Distance: {distance}
</Text>

<Text style={styles.text}>
💰 Amount: ₹{amount}
</Text>

<Text style={styles.text}>
🏠 Address: Main Road, Mumbai
</Text>

</View>

<TouchableOpacity
style={styles.btn}
onPress={()=>
router.push("/map-screen")
}
>

<Text style={styles.btnText}>
Start Delivery
</Text>

</TouchableOpacity>

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
marginBottom:20,
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:15,
},

text:{
fontSize:18,
marginBottom:12,
},

btn:{
backgroundColor:"#2563eb",
padding:15,
borderRadius:12,
marginTop:20,
},

btnText:{
color:"#fff",
fontSize:18,
fontWeight:"bold",
textAlign:"center",
}

});