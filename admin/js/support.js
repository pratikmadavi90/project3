const API = "https://api.harzo.in/api/support";

async function loadTickets(){

try{

const res = await fetch(API);

const tickets = await res.json();

const ticketList =
document.getElementById("ticketList");

ticketList.innerHTML =
tickets.map(ticket=>`

<div class="ticket">

<div class="top">

<h3>${ticket.subject}</h3>

<span class="${ticket.status||"open"}">
${ticket.status||"open"}
</span>

</div>

<p>${ticket.message}</p>

<small>
User : ${ticket.userId}
</small>

${
ticket.reply
?

`<div style="
margin-top:15px;
padding:12px;
background:#111827;
border-radius:10px;
color:#39ff14;
">

<b>Reply :</b>
${ticket.reply}

</div>`

:

`<div>

<input
id="${ticket._id}"
placeholder="Write reply..."
>

<button
onclick="replyTicket('${ticket._id}')"
>
Reply
</button>

</div>`
}

</div>

`).join("");

}catch(err){

console.log(err);

}

}

async function replyTicket(id){

try{

const reply =
document.getElementById(id)
.value;

if(!reply){

alert("Write reply");

return;

}

await fetch(
`${API}/reply/${id}`,
{

method:"PUT",

headers:{
"Content-Type":
"application/json"
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

loadTickets();