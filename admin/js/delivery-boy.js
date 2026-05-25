const API = "https://api.harzo.in/api/delivery-boy";

const saveBtn = document.getElementById("saveBtn");
const deliveryList = document.getElementById("deliveryList");
const search = document.getElementById("search");


// Load Delivery Boys
async function loadDeliveryBoys(){

try{

const res = await fetch(`${API}/all`);

console.log("STATUS:",res.status);

const result = await res.json();

console.log("DATA:",result);

const data = result.data || [];

deliveryList.innerHTML = "";

data.forEach((boy)=>{

deliveryList.innerHTML += `

<tr>

<td>${boy.name}</td>

<td>${boy.mobile}</td>

<td>${boy.deliveryId}</td>

<td>${boy.vehicle}</td>

<td>${boy.online ? "🟢 Online" : "🔴 Offline"}</td>

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

console.log("ERROR:",err);

alert("Failed to load delivery boys");

}

}



// Save Delivery Boy
saveBtn.onclick = async()=>{

const name =
document.getElementById("name").value;

const mobile =
document.getElementById("mobile").value;

const password =
document.getElementById("password").value;

const vehicle =
document.getElementById("vehicle").value;

const status =
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


try{

const res = await fetch(`${API}/add`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name,
mobile,
password,
vehicle,
status

})

});

const result = await res.json();

console.log(result);

document.getElementById("name").value="";
document.getElementById("mobile").value="";
document.getElementById("password").value="";

loadDeliveryBoys();

}catch(err){

console.log("SAVE ERROR:",err);

alert("Failed to save");

}

};




// Delete
async function deleteDeliveryBoy(id){

if(
!confirm(
"Delete delivery boy?"
)
)return;


try{

await fetch(

`${API}/delete/${id}`,

{
method:"DELETE"
}

);

loadDeliveryBoys();

}catch(err){

console.log("DELETE ERROR:",err);

}

}



// Edit
function editDeliveryBoy(id){

alert(
"Edit backend next"
);

}



// Search
search.addEventListener(
"keyup",
()=>{

let value =
search.value.toLowerCase();

let rows =
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


// Auto Load
loadDeliveryBoys();