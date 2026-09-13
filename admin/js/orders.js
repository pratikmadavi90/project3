const API = "https://api.harzo.in/api/orders";

// 🔄 GET ORDERS
async function getOrders() {
  const res = await fetch(API, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  }
});
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

      <td>${order.userId || "-"}</td>

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
  ${
    order.deliveryBoy?.name
      ? `
        <div>
          <b>${order.deliveryBoy.name}</b><br>
          <small>${order.deliveryBoy.phone || "-"}</small>
        </div>
      `
      : "-"
  }
</td>

      <td>
        <button onclick="viewOrder('${order._id}')">
          View
        </button>
      </td>

<td>
  <button class="print-btn"
    onclick="printLabel('${order._id}')">
    🖨 Print
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
  Authorization: "Bearer " + localStorage.getItem("adminToken")
},

    body: JSON.stringify({ status }),
  });

  alert("Status Updated");

  getOrders();
}

// 🚚 ASSIGN DELIVERY
async function assignDelivery(id) {

  const name =
  prompt("Delivery Boy Name:");

  const phone =
  prompt("Phone:");

  const deliveryId =
  prompt("Delivery Boy ID:");

  if (!name || !deliveryId) return;

await fetch(
  `${API}/${id}/assign-delivery`,
  {
    method:"PUT",

    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer " + localStorage.getItem("adminToken")
    },

    body:JSON.stringify({
      deliveryBoy:{
        name,
        phone,
        deliveryId
      }
    }),
  }
);

  alert("Delivery Assigned");

  getOrders();
}

// 🔍 VIEW ORDER
async function viewOrder(id) {

  const res = await fetch(`${API}/${id}`, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  }
});

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

    // ✅ PRICE FIX
    const price =
      item.price ||
      item.pricing?.mrp ||
      item.pricing?.salePrice ||
      item.pricing?.price ||
      0;

    // ✅ IMAGE FIX
    const image =
      item.image ||
      item.thumbnail ||
      item.images?.thumbnail ||
      item.images?.[0]?.url ||
      item.images?.[0]?.thumbnail ||
      "https://via.placeholder.com/100";

    // ✅ WEIGHT FIX
   const weight =
  item.weight ||
  item.size ||
  item.unit ||
  item.quantityText ||
  item.name?.match(/\d+\s?(kg|g|L|ml)/i)?.[0] ||
  "";

    itemsHTML += `
      <div class="item-row">

        <img src="${image}" class="item-img"/>

        <div class="item-info">

          <div class="item-name">
            ${item.name || "-"} 
            ${weight ? `(${weight})` : ""}
          </div>

        <div class="item-qty">
  Qty: ${qty}
</div>

<div class="item-weight">
  ${weight}
</div>  

        </div>

        <div class="item-price">
          ₹${price}
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

<div class="bill-summary">
  <div>Payment Method</div>
  <div>${order.payment?.method || "N/A"}</div>
</div>

<div class="bill-summary">
  <div>Payment Status</div>
  <div>${order.payment?.status || "N/A"}</div>
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

async function printLabel(id) {

  const res = await fetch(`${API}/${id}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    }
  });

  const order = await res.json();

  const customerName =
    order.user?.name || "-";

  const phone =
    order.user?.phone || "-";

  const address =
    order.address?.fullAddress || "-";

const paymentMethod =
order.payment?.method || "Cash On Delivery";

const isCOD =
paymentMethod.toLowerCase().includes("cash");

let paymentHTML = "";

if (isCOD) {

  paymentHTML = `
    <div class="line payment-box">
      Payment: COD
    </div>

    <div class="line payment-box">
      COLLECT ₹${order.finalAmount || order.totalAmount || 0}
    </div>
  `;

} else {

  paymentHTML = `
    <div class="line payment-box">
      Payment: ONLINE
    </div>

    <div class="line payment-box">
      PAID ✅
    </div>
  `;

}    

  const printWindow = window.open("", "", "width=300,height=600");

  printWindow.document.write(`
    <html>
    <head>
      <title>Label</title>

      <style>
        body{
          font-family:Arial;
          padding:10px;
          width:58mm;
        }

        h3{
          margin:0;
          text-align:center;
        }

        .line{
          margin-top:8px;
          font-size:13px;
        }

        hr{
          margin:8px 0;
        }
      </style>
    </head>

    <body>

      <h3>HARZO</h3>

      <hr>

      <div class="line">
        <b>Order:</b>
        ${order.orderId}
      </div>

      <div class="line">
        <b>Name:</b>
        ${customerName}
      </div>

      <div class="line">
        <b>Phone:</b>
        ${phone}
      </div>

      <div class="line">
        <b>Address:</b>
        ${address}
      </div>

<div class="line total-box">
  Total: ₹${order.finalAmount || order.totalAmount || 0}
</div>

${paymentHTML}

      <div class="line">
        <b>Date:</b>
        ${new Date(order.createdAt).toLocaleString()}
      </div>

    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}


// 🚀 LOAD DATA
getOrders();