import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from "react-native";

export default function OrderDetails({
  order,
  goBack
}) {

const updateStatus = async(status)=>{

try{

await fetch(
`https://api.harzo.in/api/orders/${order._id}/status`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status
})
}
);

Alert.alert(
"Success",
`${status} Updated`
);

}
catch(err){

console.log(err);

Alert.alert(
"Error",
"Status update failed"
);

}

};

  return (
<ScrollView
contentContainerStyle={{
paddingBottom:140
}}
style={{
flex:1,
backgroundColor:"#f5f5f5",
padding:20
}}
>

      {/* Back */}
      <TouchableOpacity
        onPress={goBack}
        style={{
          marginTop:40,
          marginBottom:20
        }}
      >
        <Text
          style={{
            fontSize:20,
            fontWeight:"bold"
          }}
        >
          ← Back
        </Text>
      </TouchableOpacity>


      {/* User Details */}
      <View
      style={{
        backgroundColor:"#fff",
        padding:15,
        borderRadius:15,
        marginBottom:20,
        elevation:5
      }}
      >

      <Text
      style={{
        fontSize:20,
        marginBottom:8
      }}
      >
      {order?.user?.name || "No Name"}
      </Text>

      <Text style={{marginBottom:5}}>
      📦 Order ID : {order?.orderId}
      </Text>

      <Text style={{marginBottom:5}}>
      🆔 User ID : {order?.userId}
      </Text>

      <Text style={{marginBottom:5}}>
      📍 {order?.address?.fullAddress}
      </Text>

      <Text style={{color:"orange"}}>
      Status : {order?.status}
      </Text>

      </View>


      {/* Product Grid */}
      <View
      style={{
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-between"
      }}
      >

      {order?.items?.map((product,index)=>(

      <View
      key={index}
      style={{
        width:"31%",
        backgroundColor:"#fff",
        padding:10,
        borderRadius:12,
        marginBottom:15,
        elevation:4,
        alignItems:"center"
      }}
      >

      <Image
      source={{
      uri:
      product.image ||
      "https://via.placeholder.com/100"
      }}
      style={{
      width:70,
      height:70,
      borderRadius:10
      }}
      />

      <Text
      numberOfLines={1}
      style={{
      marginTop:8,
      fontSize:14,
      fontWeight:"bold"
      }}
      >
      {product.name}
      </Text>

      <Text
      style={{
      fontSize:12,
      color:"#666"
      }}
      >
      Qty : {product.qty || product.quantity}
      </Text>

      <Text
      style={{
      fontSize:12,
      color:"#666"
      }}
      >
      KG : {product.weight || 0}
      </Text>

      <Text
      style={{
      fontSize:12,
      color:"#00C853",
      fontWeight:"bold"
      }}
      >
      ₹ {product.price || 0}
      </Text>

      </View>

      ))}

      </View>


      {/* Total */}

      <View
      style={{
      backgroundColor:"#fff",
      padding:15,
      borderRadius:15,
      marginBottom:20,
      elevation:4
      }}
      >

      <Text
      style={{
      fontSize:16
      }}
      >
      Total Items : {order?.items?.length}
      </Text>

      <Text
      style={{
      fontSize:18,
      fontWeight:"bold",
      color:"#00C853",
      marginTop:8
      }}
      >
      Total Amount : ₹ {order?.totalAmount || 0}
      </Text>

      </View>


{/* Staff Buttons */}

<View
style={{
marginBottom:100
}}
>

{/* Accept Button */}

<TouchableOpacity
onPress={()=>updateStatus("Accepted")}
disabled={order?.status !== "Pending"}
style={{
backgroundColor:
order?.status==="Pending"
? "#00C853"
: "#ccc",

padding:15,
borderRadius:12,
marginBottom:12
}}
>

<Text
style={{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
}}
>
Accept Order
</Text>

</TouchableOpacity>


{/* Packed Button */}

{/* Packed Button */}

<TouchableOpacity
onPress={() => updateStatus("Packed")}
style={{
backgroundColor:"#FF9800",
padding:15,
borderRadius:12,
marginBottom:12,

opacity:
order?.status==="Accepted"
? 1
: 0.7
}}
>

<Text
style={{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
}}
>
Packed Order
</Text>

</TouchableOpacity>


{/* Ready Status */}

{order?.status==="Packed" && (

<View
style={{
backgroundColor:"#2962FF",
padding:15,
borderRadius:12
}}
>

<Text
style={{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
}}
>
Ready For Delivery 🚚
</Text>

</View>

)}

</View>



    </ScrollView>
  );
}