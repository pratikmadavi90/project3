import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";

const API = "https://api.harzo.in/api/orders";

export default function NewOrders({ goDetails, goBack }) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {

loadOrders();

const interval = setInterval(() => {
loadOrders();
},1000);

return ()=>clearInterval(interval);

},[]);


  const loadOrders = async () => {
    try {
      const response = await fetch(API);

      const data = await response.json();

      setOrders(data);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const deleteOrder = (id) => {

    Alert.alert(
      "Delete Order",
      "Delete this order?",
      [
        {
          text: "Cancel"
        },

        {
          text: "Delete",

          onPress: async () => {
            try {

              await fetch(
                `${API}/${id}`,
                {
                  method: "DELETE"
                }
              );

              loadOrders();

            } catch (err) {
              console.log(err);
            }
          }
        }
      ]
    );

  };

  return (

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
        New Orders
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
          data={orders}
          keyExtractor={(item)=>item._id}

          renderItem={({item}) => (

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
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
      borderRadius:20,
      minWidth:85,
      alignItems:"center"
    }}
  >

    <Text
      style={{
        color:"#fff",
        fontWeight:"bold",
        fontSize:13
      }}
    >
      {item.status}
    </Text>

  </View>

</View>


              <Text
                style={{
                  marginTop:10,
                  color:"#666"
                }}
              >
                📦 Order ID : {item.orderId}
              </Text>

              <Text
                style={{
                  marginTop:5,
                  color:"#666"
                }}
              >
                🆔 User ID : {item.userId}
              </Text>

              <Text
                style={{
                  marginTop:5,
                  color:"#666"
                }}
              >
                📍 {item.address?.fullAddress || "No Address"}
              </Text>

              <Text
                style={{
                  marginTop:5,
                  color:"#666"
                }}
              >
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