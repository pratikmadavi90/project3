import React,{useState} from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API = "https://api.harzo.in/api/staff/login";

export default function LoginScreen({goDashboard}){

const [staffId, setStaffId] = useState("");
const [password,setPassword]=useState("");

const login=async()=>{

if (!staffId || !password){

Alert.alert(
"Error",
"Enter email and password"
);

return;
}

try{

const response=await fetch(
API,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
    staffId,
    password
})
}
);

const data=await response.json();

if (data.success) {

    await AsyncStorage.setItem(
      "staffToken",
      data.token
    );

    await AsyncStorage.setItem(
      "staff",
      JSON.stringify(data.staff || data.user)
    );

    goDashboard();

} else {

Alert.alert(
"Error",
"Invalid email or password"
);

}

}catch(err){

console.log(err);

Alert.alert(
"Error",
"Login failed"
);

}

};

return(

<View style={styles.container}>

<Text style={styles.branch}>
MH34
</Text>

<Text style={styles.logo}>
HARZO STAFF
</Text>

<TextInput
placeholder="Enter Staff ID"
value={staffId}
onChangeText={setStaffId}
autoCapitalize="none"
autoCapitalize="none"
style={styles.input}
/>

<TextInput
placeholder="Enter Password"
value={password}
onChangeText={setPassword}
secureTextEntry
style={styles.input}
/>

<TouchableOpacity
style={styles.button}
onPress={login}
>

<Text style={styles.logo}>
HARZO STAFF
</Text>

<Text style={{
    textAlign:"center",
    marginBottom:25,
    color:"#666"
}}>
Staff Login
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

branch:{
fontSize:28,
fontWeight:"bold",
textAlign:"center",
color:"#16A34A",
marginBottom:10
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