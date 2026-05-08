const API = "https://api.harzo.in/api/orders";

// 🔄 GET ORDERS
async function getOrders() {
  const res = await fetch(API);
  const orders = await res.json();

  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  orders.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.user?.name || "-"}</td>
      <td>${order.user?.phone || "-"}</td>
      <td>${order.address?.fullAddress || "-"}</td>
      <td>₹${order.totalAmount}</td>

      <td>
        <select onchange="updateStatus('${order._id}', this.value)">
          <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${order.status === "Accepted" ? "selected" : ""}>Accepted</option>
          <option ${order.status === "Packed" ? "selected" : ""}>Packed</option>
          <option ${order.status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
          <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
          <option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
        </select>
      </td>

      <td>
        <button onclick="assignDelivery('${order._id}')">Assign</button>
      </td>

      <td>
        <button onclick="viewOrder('${order._id}')">View</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// 🔄 UPDATE STATUS
async function updateStatus(id, status) {
  await fetch(`${API}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  alert("Status Updated");
  getOrders();
}

// 🚚 ASSIGN DELIVERY
async function assignDelivery(id) {
  const name = prompt("Delivery Boy Name:");
  const phone = prompt("Phone:");

  if (!name) return;

  await fetch(`${API}/${id}/assign-delivery`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deliveryBoy: { name, phone }
    })
  });

  alert("Delivery Assigned");
  getOrders();
}

// 🔍 VIEW ORDER (POPUP)
async function viewOrder(id) {
  const res = await fetch(`${API}/${id}`);
  const order = await res.json();

  let itemsHTML = "";

  (order.items || []).forEach(item => {
  itemsHTML += `
  <div class="item-row">
    <img src="${item.image}" class="item-img"/>

    <div class="item-info">
      <div class="item-name">${item.name}</div>
      <div class="item-qty">Qty: ${item.qty}</div>
    </div>

    <div class="item-price">₹${item.price * item.qty}</div>
  </div>
`;
  });

 document.getElementById("orderDetails").innerHTML = `
  <div class="bill-header">
    <h3>Order ID: ${order.orderId}</h3>
    <p>${order.user?.name || "-"} | ${order.user?.phone || "-"}</p>
<p>${order.address?.fullAddress || "-"}</p>
  </div>

  <hr>

  <div class="items-container">
    ${itemsHTML}
  </div>

  <hr>

  <div class="bill-summary">
    <div>Items Total</div>
    <div>₹${order.totalAmount}</div>
  </div>

  <div class="bill-summary total-final">
    <div>To Pay</div>
    <div>₹${order.totalAmount}</div>
  </div>

  <div class="bill-status">
    Status: <b>${order.status}</b>
  </div>
`;

  document.getElementById("orderPopup").style.display = "block";
}


// ❌ CLOSE POPUP
function closePopup() {
  document.getElementById("orderPopup").style.display = "none";
}

// 🚀 LOAD DATA
getOrders();