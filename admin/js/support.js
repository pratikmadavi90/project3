const API = "https://api.harzo.in/api/support";

async function loadTickets() {

try{

const res = await fetch(API);

const tickets = await res.json();

const ticketList =
document.getElementById("ticketList");

ticketList.innerHTML="";

tickets.forEach(ticket=>{

const div =
document.createElement("div");

div.className="ticket";

div.innerHTML=`

<div class="top">

<h3>${ticket.subject}</h3>

<span class="${ticket.status || "open"}">
${ticket.status || "open"}
</span>

</div>

<p>${ticket.message}</p>

<div style="
margin-top:10px;
line-height:28px;
">

<b>👤 ${ticket.name || "Unknown"}</b>

<br>

📞 ${ticket.phone || "No Phone"}

<br>

📍 ${ticket.address || "No Address"}

</div>

`;

if(ticket.reply){

div.innerHTML +=`

<div style="
margin-top:15px;
padding:12px;
background:#111827;
border-radius:10px;
color:#39ff14;
">

<b>Reply:</b>

${ticket.reply}

</div>

`;

}else{

div.innerHTML +=`

<div style="
display:flex;
margin-top:15px;
gap:10px;
">

<input
id="${ticket._id}"
placeholder="Write reply..."
style="flex:1"
/>

<button
onclick="replyTicket('${ticket._id}')"
>
Reply
</button>

</div>

`;

}

/* Delete button added */
div.innerHTML += `

<div style="
margin-top:15px;
text-align:right;
">

<button
onclick="deleteTicket('${ticket._id}')"
style="
background:red;
color:white;
border:none;
padding:8px 14px;
border-radius:8px;
cursor:pointer;
"
>

Delete

</button>

</div>

`;

ticketList.appendChild(div);

});

}catch(err){

console.log(err);

}

}

async function replyTicket(id){

try{

const reply =
document.getElementById(id).value;

if(!reply){

alert(
"Write reply"
);

return;
}

await fetch(

`${API}/reply/${id}`,

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
reply
})

}

);

loadTickets();

}catch(err){

console.log(err);

}

}

async function deleteTicket(id){

try{

const ok =
confirm(
"Delete this ticket?"
);

if(!ok) return;

await fetch(

`${API}/${id}`,

{
method:"DELETE"
}

);

loadTickets();

}catch(err){

console.log(err);

}

}

loadTickets();