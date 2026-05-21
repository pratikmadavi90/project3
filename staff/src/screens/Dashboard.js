import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Dashboard({ goOrders }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HARZO STAFF</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={goOrders}
      >
        <Text style={styles.text}>
          New Orders
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
    fontSize:30,
    fontWeight:"bold",
    marginBottom:30
  },
  button:{
    backgroundColor:"#000",
    padding:20,
    borderRadius:10
  },
  text:{
    color:"#fff"
  }
});