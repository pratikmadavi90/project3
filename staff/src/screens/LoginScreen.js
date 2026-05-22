import React,{useState} from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";

const API="https://api.harzo.in/api/admin";

export default function LoginScreen({goDashboard}){

const [email,setEmail]=useState("");
const [otp,setOtp]=useState("");
const [showOtp,setShowOtp]=useState(false);

const sendOTP = async () => {

if(!email){
alert("Enter Email");
return;
}

try{

const response=await fetch(
"https://api.harzo.in/api/admin/send-otp",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email
})
}
);

const data=await response.json();

alert(data.message);

setOtpSent(true);

}catch(err){

console.log(err);

alert("Failed");

}

};

const verifyOTP=async()=>{

try{

const response=await fetch(
`${API}/verify-otp`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
otp
})
}
);

const data=await response.json();

if(
data.message.includes("success")
){

goDashboard();

}else{

Alert.alert(data.message);

}

}
catch(err){

Alert.alert("Error");

}

};

return(

<View style={styles.container}>

<Text style={styles.logo}>
HARZO STAFF
</Text>

<TextInput
placeholder="Enter Email"
value={email}
onChangeText={setEmail}
style={styles.input}
/>

{showOtp && (

<TextInput
placeholder="Enter OTP"
value={otp}
onChangeText={setOtp}
keyboardType="numeric"
style={styles.input}
/>

)}

<TouchableOpacity
style={styles.button}
onPress={
showOtp
?verifyOTP
:sendOTP
}
>

<Text style={styles.text}>
{showOtp
?"Verify OTP"
:"Send OTP"}
</Text>

</TouchableOpacity>

</View>

)

}

const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:25,
backgroundColor:"#f6f7fb"
},

logo:{
fontSize:34,
fontWeight:"bold",
marginBottom:40,
textAlign:"center",
color:"#16A34A"
},

input:{
backgroundColor:"#fff",
padding:16,
borderRadius:15,
marginBottom:15,
elevation:5
},

button:{
backgroundColor:"#16A34A",
padding:16,
borderRadius:15
},

text:{
color:"#fff",
fontWeight:"bold",
textAlign:"center",
fontSize:16
}

});