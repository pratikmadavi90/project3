const API="https://api.harzo.in/api/returns";

const returnList=
document.getElementById(
"returnList"
);

const searchInput=
document.getElementById(
"searchInput"
);

const statusFilter=
document.getElementById(
"statusFilter"
);

let allReturns=[];


async function loadReturns(){

try{

document.getElementById(
"loading"
).style.display="block";

const res=
await fetch(

`${API}/all`

);

const data=
await res.json();

allReturns=
data.data||[];

renderReturns();

document.getElementById(
"loading"
).style.display="none";

}catch(err){

returnList.innerHTML=`

<div class="empty">

Error loading returns

</div>

`;

}

}


function renderReturns(){

const search=
searchInput.value.toLowerCase();

const status=
statusFilter.value;

const filtered=

allReturns.filter(item=>{

const matchSearch=

item.returnId
.toLowerCase()
.includes(search)

||

item.productName
.toLowerCase()
.includes(search)

||

item.orderId
.toLowerCase()
.includes(search);


const matchStatus=

status===""
||

item.status===status;

return matchSearch
&&
matchStatus;

});


if(filtered.length===0){

returnList.innerHTML=`

<div class="empty">

No return requests found

</div>

`;

return;

}


returnList.innerHTML=

filtered.map(item=>`

<div class="card">

<h3>

${item.returnId}

</h3>

<p>

Order:
${item.orderId}

</p>

<p>

Product:
${item.productName}

</p>

<p>

Quantity:
${item.quantity}

</p>

<p>

Reason:
${item.reason}

</p>

<p>

Status:
<b>

${item.status}

</b>

</p>

<p>

Date:
${new Date(
item.createdAt
).toLocaleString()}

</p>

${
item.image?

`<img src="${item.image}">`

:

""
}

<textarea
id="note-${item._id}"
placeholder="Admin note"
>

${item.adminNote||""}

</textarea>

<div class="buttons">

<button
onclick="updateStatus(
'${item._id}',
'Approved'
)"
>

Approve

</button>


<button
onclick="updateStatus(
'${item._id}',
'Rejected'
)"
>

Reject

</button>


<button
onclick="updateStatus(
'${item._id}',
'Picked'
)"
>

Picked

</button>


<button
onclick="updateStatus(
'${item._id}',
'Refunded'
)"
>

Refunded

</button>

</div>

</div>

`).join("");

}


async function updateStatus(
id,
status
){

const note=

document.getElementById(
`note-${id}`
).value;


try{

await fetch(

`${API}/status/${id}`,

{

method:"PUT",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

status,
adminNote:note

})

}

);

loadReturns();

}catch(err){

alert(
"Update failed"
);

}

}


searchInput.addEventListener(

"input",

renderReturns

);


statusFilter.addEventListener(

"change",

renderReturns

);


loadReturns();