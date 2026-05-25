const API = "https://api.harzo.in/api/delivery-boy";

const saveBtn=document.getElementById("saveBtn");
const deliveryList=document.getElementById("deliveryList");
const search=document.getElementById("search");


// Load delivery boys
async function loadDeliveryBoys(){

try{

const res=await fetch(`${API}/all`);

const result=await res.json();

const data=result.data || [];

deliveryList.innerHTML="";

data.forEach((boy,index)=>{

deliveryList.innerHTML+=`

<tr>

<td>${boy.name}</td>

<td>${boy.mobile}</td>

<td>${boy.deliveryId}</td>

<td>${boy.vehicle}</td>

<td class="${
boy.status==="Active"
?
"active"
:
"inactive"
}">
${boy.status}
</td>

<td>

<button
class="edit"
onclick="editDeliveryBoy('${boy._id}')">

Edit

</button>

<button
class="delete"
onclick="deleteDeliveryBoy('${boy._id}')">

Delete

</button>

</td>

</tr>

`;

});

}catch(err){

console.log(err);

alert("Failed to load delivery boys");

}

}



// Save delivery boy

saveBtn.onclick=async()=>{

const name=
document.getElementById("name").value;

const mobile=
document.getElementById("mobile").value;

const password=
document.getElementById("password").value;

const vehicle=
document.getElementById("vehicle").value;

const status=
document.getElementById("status").value;

if(
!name ||
!mobile ||
!password
){

return alert(
"Fill all fields"
);

}

await fetch(`${API}/add`,{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

name,
mobile,
password,
vehicle,
status

})

});

document.getElementById("name").value="";
document.getElementById("mobile").value="";
document.getElementById("password").value="";

loadDeliveryBoys();

};



// Delete

async function deleteDeliveryBoy(id){

if(
!confirm(
"Delete delivery boy?"
)
)return;

await fetch(

`${API}/delete/${id}`,

{
method:"DELETE"
}

);

loadDeliveryBoys();

}



// Edit structure

function editDeliveryBoy(id){

alert(
"Edit feature backend next"
);

}



// Search

search.addEventListener(
"keyup",
()=>{

let value=
search.value.toLowerCase();

let rows=
document.querySelectorAll(
"#deliveryList tr"
);

rows.forEach(row=>{

row.style.display=
row.innerText
.toLowerCase()
.includes(value)

?

""

:

"none";

});

});



loadDeliveryBoys();