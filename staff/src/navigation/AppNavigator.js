import React,{useState} from "react";

import LoginScreen from "../screens/LoginScreen";
import Dashboard from "../screens/Dashboard";
import NewOrders from "../screens/NewOrders";
import OrderDetails from "../screens/OrderDetails";

export default function AppNavigator(){

const [screen,setScreen]=useState("login");

const [selectedOrder,setSelectedOrder]=useState(null);

const [selectedDay,setSelectedDay]=useState(null);


if(screen==="login"){

return(

<LoginScreen
goDashboard={()=>{
setScreen("dashboard");
}}
/>

);

}

if(screen==="orders"){

return(

<NewOrders

selectedDay={selectedDay}

goBack={()=>{
setScreen("dashboard")
}}

goDetails={(order)=>{

setSelectedOrder(order);

setScreen("details");

}}

/>

);

}

if(screen==="details"){

return(

<OrderDetails

order={selectedOrder}

goBack={()=>{
setScreen("orders")
}}

/>

);

}

return(

<Dashboard

goOrders={(day)=>{

setSelectedDay(day);

setScreen("orders");

}}

/>

);

}