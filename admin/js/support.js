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

   </div>

   `).join("");

 } catch(err){
   console.log(err);
 }

}

loadTickets();