let count=1;

let saveBtn=document.getElementById("saveBtn");
let deliveryList=document.getElementById("deliveryList");

document.getElementById(
"deliveryId"
).value="DLV001";

saveBtn.onclick=()=>{

let name=
document.getElementById("name").value;

let mobile=
document.getElementById("mobile").value;

let deliveryId=
document.getElementById("deliveryId").value;

let vehicle=
document.getElementById("vehicle").value;

let status=
document.getElementById("status").value;


if(
name=="" ||
mobile==""
){

alert("Fill all fields");
return;

}

deliveryList.innerHTML+=`

<tr>

<td>${name}</td>

<td>${mobile}</td>

<td>${deliveryId}</td>

<td>${vehicle}</td>

<td class="${
status=="Active"
?
"active"
:
"inactive"
}">
${status}
</td>

<td>

<button
class="edit">
Edit
</button>

<button
class="delete"
onclick="this.parentElement.parentElement.remove()">

Delete

</button>

</td>

</tr>

`;

count++;

document.getElementById(
"deliveryId"
).value=
"DLV00"+count;

};