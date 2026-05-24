const API = "https://api.harzo.in/api/support";

async function loadTickets() {

 try {

   const res = await fetch(API);

   const tickets = await res.json();

   const ticketList =
   document.getElementById("ticketList");

   ticketList.innerHTML =
   tickets.map(ticket=>`

   <div class="ticket">

      <div class="top">

      <h3>${ticket.subject}</h3>

      <span class="${ticket.status}">
      ${ticket.status}
      </span>

      </div>

      <p>${ticket.message}</p>

      <small>
      User : ${ticket.userId}
      </small>

      <br><br>

      ${
      ticket.reply
      ?

      `<div style="
      margin-top:10px;
      padding:10px;
      background:#1f2937;
      border-radius:8px;
      color:#22c55e;
      ">
      Reply :
      ${ticket.reply}
      </div>`

      :

      `

      <input
      id="${ticket._id}"
      placeholder="Write reply..."
      style="
      width:80%;
      padding:10px;
      border-radius:8px;
      border:none;
      margin-top:10px;
      "
      />

      <button
      onclick="replyTicket('${ticket._id}')"
      style="
      background:#22c55e;
      border:none;
      padding:10px 15px;
      border-radius:8px;
      margin-left:8px;
      cursor:pointer;
      "
      >
      Reply
      </button>

      `
      }

   </div>

   `).join("");

 } catch(err){

   console.log(err);

 }

}


async function replyTicket(id){

try{

const reply =
document.getElementById(id)
.value;

if(!reply){

alert(
"Enter reply"
);

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