const API = "https://api.harzo.in/api/orders";

// 🔄 GET ORDERS
async function getOrders() {
  const res = await fetch(API);
  const orders = await res.json();

  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  orders.forEach(order => {
    const row = document.createElement("tr");

    // ✅ SUPPORT OLD + NEW DATA
    const customerName =
      order.customerName ||
      order.user?.name ||
      "-";

    const phone =
      order.phone ||
      order.user?.phone ||
      "-";

    const address =
      typeof order.address === "object"
        ? order.address?.fullAddress || "-"
        : order.address || "-";

    const total =
      order.finalAmount ||
      order.totalAmount ||
      0;

    row.innerHTML = `
      <td>${order.orderId || "-"}</td>

      <td>${customerName}</td>

      <td>${phone}</td>

      <td>${address}</td>

      <td>₹${total}</td>

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
        <button onclick="assignDelivery('${order._id}')">
          Assign
        </button>
      </td>

      <td>
        <button onclick="viewOrder('${order._id}')">
          View
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

// 🔄 UPDATE STATUS
async function updateStatus(id, status) {
  await fetch(`${API}/${id}/status`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ status }),
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

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      deliveryBoy: {
        name,
        phone,
      },
    }),
  });

  alert("Delivery Assigned");

  getOrders();
}

// 🔍 VIEW ORDER
async function viewOrder(id) {

  const res = await fetch(`${API}/${id}`);

  const order = await res.json();

  // ✅ SUPPORT OLD + NEW DATA

  const customerName =
    order.customerName ||
    order.user?.name ||
    "-";

  const phone =
    order.phone ||
    order.user?.phone ||
    "-";

  const address =
    typeof order.address === "object"
      ? order.address?.fullAddress || "-"
      : order.address || "-";

  const total =
    order.finalAmount ||
    order.totalAmount ||
    0;

  let itemsHTML = "";

  (order.items || []).forEach(item => {

    const qty =
      item.quantity ||
      item.qty ||
      1;

    const price =
      item.price || 0;

    const image =
      item.image ||
      "";

    itemsHTML += `
      <div class="item-row">

        <img src="${image}" class="item-img"/>

        <div class="item-info">

          <div class="item-name">
            ${item.name || "-"}
          </div>

          <div class="item-qty">
            Qty: ${qty}
          </div>

        </div>

        <div class="item-price">
          ₹${price * qty}
        </div>

      </div>
    `;
  });

  document.getElementById("orderDetails").innerHTML = `

    <div class="bill-header">

      <h3>
        Order ID: ${order.orderId || "-"}
      </h3>

      <p>
        ${customerName} | ${phone}
      </p>

      <p>
        ${address}
      </p>

    </div>

    <hr>

    <div class="items-container">
      ${itemsHTML}
    </div>

    <hr>

    <div class="bill-summary">

      <div>
        Items Total
      </div>

      <div>
        ₹${total}
      </div>

    </div>

    <div class="bill-summary total-final">

      <div>
        To Pay
      </div>

      <div>
        ₹${total}
      </div>

    </div>

    <div class="bill-status">

      Status:
      <b>${order.status}</b>

    </div>
  `;

  document.getElementById(
    "orderPopup"
  ).style.display = "block";
}

// ❌ CLOSE POPUP
function closePopup() {
  document.getElementById(
    "orderPopup"
  ).style.display = "none";
}

// 🚀 LOAD DATA
getOrders();