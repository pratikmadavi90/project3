const API = "https://api.harzo.in/api/offers";

// ✅ ADD OFFER
async function addOffer() {
  const data = {
    title: document.getElementById("title").value,
    type: document.getElementById("type").value,
    value: document.getElementById("value").value,
    minOrderAmount: document.getElementById("minOrderAmount").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
  };

  console.log("Sending:", data); // 🔍 debug

  await fetch(API + "/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  loadOffers();
}

// ✅ LOAD OFFERS
async function loadOffers() {
  const res = await fetch(API);
  const data = await res.json();

  console.log("Received:", data); // 🔍 debug

  let html = "";

  (data || []).forEach((o) => {
    html += `
      <div class="offer-card">
        <h3>${o.title || "No Title"}</h3>
        <p>Type: ${o.type}</p>
        <p>Value: ${o.value}</p>
        <p>Min Order: ${o.minOrderAmount}</p>

        <button onclick="deleteOffer('${o._id}')">Delete</button>
      </div>
    `;
  });

  document.getElementById("offerList").innerHTML = html;
}

// ✅ DELETE OFFER
async function deleteOffer(id) {
  await fetch(API + "/" + id, {
    method: "DELETE",
  });

  loadOffers();
}

// ✅ PAGE LOAD PE CALL
loadOffers();