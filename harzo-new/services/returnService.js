import axios from "axios";

const API_URL = "https://api.harzo.in/api/returns";


export const createReturn = async(data)=>{

try{

const response=await axios.post(

`${API_URL}/create`,
data

);

return response.data;

}catch(error){

console.log(
"Create Return Error:",
error?.response?.data || error.message
);

throw error;

}

};



export const getMyReturns=async(userId)=>{

try{

const response=await axios.get(

`${API_URL}/user/${userId}`

);

return response.data;

}catch(error){

console.log(

"Get Returns Error:",
error?.response?.data || error.message

);

throw error;

}

};



export const updateReturnStatus=async(

id,
status,
adminNote=""

)=>{

try{

const response=await axios.put(

`${API_URL}/status/${id}`,

{

status,
adminNote

}

);

return response.data;

}catch(error){

console.log(

"Update Return Error:",
error?.response?.data || error.message

);

throw error;

}

};