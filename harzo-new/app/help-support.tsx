import React, { useState } from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API =
"https://api.harzo.in/api/support";

export default function HelpSupport(){

const [subject,setSubject]=
useState("");

const [message,setMessage]=
useState("");

const sendSupport=async()=>{

try{

if(!subject || !message){

Alert.alert(
"Error",
"Fill all fields"
);

return;
}

const savedUser=
await AsyncStorage.getItem(
"user"
);

const user=
JSON.parse(savedUser || "{}");

const res=
await fetch(API,{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

name:user.name,
phone:user.phone,
address:user.address,

subject,
message

})

});

await res.json();

Alert.alert(
"Success",
"Support request sent"
);

setSubject("");
setMessage("");

}catch(err){

console.log(err);

Alert.alert(
"Error",
"Failed"

);

}

};

return(

<View style={styles.container}>

<Text style={styles.title}>
Help & Support
</Text>

<TextInput
placeholder="Subject"
value={subject}
onChangeText={setSubject}
style={styles.input}
/>

<TextInput
placeholder="Message"
value={message}
onChangeText={setMessage}
multiline
style={styles.message}
/>

<TouchableOpacity
style={styles.btn}
onPress={sendSupport}
>

<Text style={styles.btnText}>
Send
</Text>

</TouchableOpacity>

</View>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#f8fafc"
},

title:{
fontSize:28,
fontWeight:"700",
marginBottom:25
},

input:{
backgroundColor:"#fff",
padding:15,
borderRadius:15,
marginBottom:15,
borderWidth:1,
borderColor:"#e5e7eb"
},

message:{
backgroundColor:"#fff",
padding:15,
borderRadius:15,
height:120,
marginBottom:20,
borderWidth:1,
borderColor:"#e5e7eb"
},

btn:{
backgroundColor:"#22c55e",
padding:16,
borderRadius:15,
alignItems:"center"
},

btnText:{
color:"#fff",
fontWeight:"700",
fontSize:16
}

});