import React, {
useState,
useEffect
} from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
ScrollView
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API =
"https://api.harzo.in/api/support";

export default function HelpSupport(){

const [subject,setSubject]=
useState("");

const [message,setMessage]=
useState("");

const [tickets,setTickets]=
useState<any[]>([]);


// LOAD USER TICKETS
const loadTickets=async()=>{

try{

const savedUser=
await AsyncStorage.getItem(
"user"
);

const user=
JSON.parse(savedUser || "{}");

const res=
await fetch(API);

const data=
await res.json();

const myTickets=
data.filter(
(item:any)=>

item.phone===user.phone

);

setTickets(myTickets);

}catch(err){

console.log(err);

}

};


useEffect(()=>{

loadTickets();

},[]);


// SEND SUPPORT
const sendSupport=async()=>{

try{

const savedUser=
await AsyncStorage.getItem(
"user"
);

const user=
JSON.parse(savedUser || "{}");


// Profile check
if(
!user.name ||
!user.phone ||
!user.address
){

Alert.alert(
"Complete Profile",
"Please save profile and delivery address first"
);

return;

}


// Subject/message check
if(!subject || !message){

Alert.alert(
"Error",
"Fill all fields"
);

return;

}

const res=
await fetch(API,{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

userId:user.userId,
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

loadTickets();

}catch(err){

console.log(err);

Alert.alert(
"Error",
"Failed"
);

}

};

return(

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{
paddingBottom:120
}}
>

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


{/* MY TICKETS */}

<Text
style={{
fontSize:20,
fontWeight:"700",
marginTop:25,
marginBottom:15
}}
>
My Support Tickets
</Text>


{tickets.map((item:any,index)=>(

<View
key={index}
style={styles.ticket}
>

<Text
style={{
fontWeight:"700",
fontSize:16
}}
>
{item.subject}
</Text>

<Text
style={{
marginTop:5
}}
>
{item.message}
</Text>

<Text
style={{
marginTop:10,
color:"#6b7280"
}}
>
Status :
{item.status}
</Text>

{item.reply && (

<View
style={{
marginTop:12,
padding:12,
backgroundColor:"#ecfdf5",
borderRadius:10
}}
>

<Text
style={{
color:"#16a34a",
fontWeight:"700"
}}
>
Admin Reply
</Text>

<Text
style={{
marginTop:5
}}
>
{item.reply}
</Text>

</View>

)}

</View>

))}

</ScrollView>

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
},

ticket:{
backgroundColor:"#fff",
padding:15,
borderRadius:15,
marginBottom:15,
borderWidth:1,
borderColor:"#e5e7eb"
}

});