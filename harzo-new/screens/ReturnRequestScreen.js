import React,{useState} from "react";

import {
View,
Text,
StyleSheet,
TextInput,
TouchableOpacity,
Alert,
ScrollView
} from "react-native";

import {createReturn} from "../services/returnService";

export default function ReturnRequestScreen(){

const [reason,setReason]=useState("");
const [comment,setComment]=useState("");
const [loading,setLoading]=useState(false);

const reasons=[

"Wrong Product",
"Damaged Product",
"Quality Issue",
"Other"

];


async function submitReturn(){

if(!reason){

Alert.alert(
"Error",
"Please select reason"
);

return;

}

try{

setLoading(true);

const data={

orderId:"ORD123",
userId:"USER123",
productId:"PROD123",
productName:"Product",
quantity:1,

reason,
comment

};

await createReturn(data);

Alert.alert(
"Success",
"Return request submitted"
);

setReason("");
setComment("");

}catch(error){

Alert.alert(
"Error",
"Failed to submit return"
);

}finally{

setLoading(false);

}

}

return(

<ScrollView
style={styles.container}
>

<Text style={styles.title}>
Return Request
</Text>

<Text style={styles.label}>
Select Reason
</Text>

{

reasons.map(item=>(

<TouchableOpacity

key={item}

style={[

styles.reasonBtn,

reason===item
&&
styles.activeBtn

]}

onPress={()=>{

setReason(item);

}}

>

<Text
style={styles.btnText}
>

{item}

</Text>

</TouchableOpacity>

))

}

<TextInput

placeholder="Comment"

placeholderTextColor="#888"

multiline

value={comment}

onChangeText={setComment}

style={styles.input}

/>


<TouchableOpacity

style={styles.submitBtn}

onPress={submitReturn}

disabled={loading}

>

<Text
style={styles.submitText}
>

{

loading

?

"Submitting..."

:

"Submit Return"

}

</Text>

</TouchableOpacity>

</ScrollView>

);

}


const styles=StyleSheet.create({

container:{

flex:1,
backgroundColor:"#f8fafc",
padding:20

},

title:{

fontSize:28,
fontWeight:"bold",
color:"#111827",
marginBottom:25

},

label:{

color:"#334155",
marginBottom:10,
fontSize:16,
fontWeight:"600"

},

reasonBtn:{

backgroundColor:"#ffffff",
padding:12,
borderRadius:12,
marginBottom:10,

shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:4,
shadowOffset:{
width:0,
height:2
},

elevation:2

},

activeBtn:{

borderWidth:2,
borderColor:"#22c55e"

},

btnText:{

color:"#111827",
fontSize:16,
fontWeight:"600"

},

input:{

backgroundColor:"#ffffff",
marginTop:20,
borderRadius:12,
padding:15,
height:100,
color:"#111827",
textAlignVertical:"top"

},

submitBtn:{

backgroundColor:"#22c55e",
padding:15,
marginTop:20,
borderRadius:12

},

submitText:{

textAlign:"center",
fontWeight:"bold",
fontSize:16,
color:"white"

}

});