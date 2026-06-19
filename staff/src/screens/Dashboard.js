import React,{useEffect,useState} from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
ActivityIndicator
} from "react-native";

const API="https://api.harzo.in/api/orders";

export default function Dashboard({goOrders}){

const [days,setDays]=useState([]);
const [loading,setLoading]=useState(true);

const labels=[
"Today",
"Yesterday",
"Day Before",
"3 Days",
"4 Days",
"5 Days",
"6 Days"
];

useEffect(()=>{

loadOrders();

},[]);


const loadOrders=async()=>{

try{

const response=await fetch(API);

const data=await response.json();

const temp=[];

for(let i=0;i<7;i++){

const date=new Date();

date.setDate(date.getDate()-i);

date.setHours(0,0,0,0);

const count=data.filter(order=>{

const orderDate=new Date(
order.createdAt
);

orderDate.setHours(
0,0,0,0
);

const diff=Math.floor(
(date-orderDate)
/(1000*60*60*24)
);

return diff===0;

}).length;


temp.push({

title:labels[i],

orders:count,

date:date.toLocaleDateString(
"en-IN",
{
day:"numeric",
month:"short"
}
)

});

}

setDays(temp);

}
catch(err){

console.log(err);

}

setLoading(false);

};


return(

<ScrollView style={styles.container}>

<View style={styles.header}>

<Text style={styles.title}>
Welcome to Harzo Staff
</Text>

<Text style={styles.branch}>
MH34
</Text>

<Text style={styles.place}>
SHRIKE
</Text>

</View>

<Text style={styles.section}>
Order Overview
</Text>

{loading ? (

<ActivityIndicator
size="large"
style={{marginTop:50}}
/>

):(

<View style={styles.grid}>

{days.map((item,index)=>(

<TouchableOpacity
key={index}
style={styles.card}
onPress={()=>
goOrders(item.title)
}
>

<Text style={styles.cardTitle}>
{item.title}
</Text>

<Text style={styles.count}>
{item.orders}
</Text>

<Text style={styles.orderText}>
Orders
</Text>

<Text style={styles.date}>
{item.date}
</Text>

</TouchableOpacity>

))}

</View>

)}

</ScrollView>

)

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f6f7fb"
},

header:{
backgroundColor:"#16A34A",
paddingTop:50,
paddingBottom:35,
borderBottomLeftRadius:30,
borderBottomRightRadius:30,
alignItems:"center"
},

title:{
fontSize:28,
fontWeight:"bold",
color:"#fff",
textAlign:"center"
},

branch:{
fontSize:32,
fontWeight:"bold",
marginTop:15,
color:"#fff"
},

place:{
fontSize:18,
color:"#d1fae5"
},

section:{
fontSize:22,
fontWeight:"bold",
margin:18
},

grid:{
paddingHorizontal:15,
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

card:{
width:"47%",
backgroundColor:"#fff",
borderRadius:22,
padding:16,
marginBottom:15,
elevation:6
},

cardTitle:{
fontWeight:"bold",
fontSize:16
},

count:{
fontSize:38,
fontWeight:"bold",
color:"#16A34A",
marginTop:10
},

orderText:{
color:"#666"
},

date:{
marginTop:10,
fontSize:12,
color:"#999"
}

});