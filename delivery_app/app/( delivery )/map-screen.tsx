import React from "react";

import {
View,
Text,
StyleSheet
} from "react-native";

export default function MapScreen(){

return(

<View style={styles.container}>

<Text style={styles.text}>
🗺 Delivery Map Screen
</Text>

<Text style={styles.subText}>
Route yaha dikhega
</Text>

</View>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"#fff"
},

text:{
fontSize:24,
fontWeight:"bold"
},

subText:{
fontSize:16,
marginTop:10,
color:"gray"
}

});