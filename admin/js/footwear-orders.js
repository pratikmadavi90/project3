const API = "https://api.harzo.in/api/footwear-orders";

// LOAD ORDERS
async function getOrders() {

  const res = await fetch(`${API}/all`, {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("adminToken")
    }
  });

  const orders = await res.json();
console.log("API RESPONSE =", orders);

  const table =
    document.getElementById(
      "ordersTable"
    );

  table.innerHTML = "";

  orders.orders.forEach(order => {

    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderId || "-"}</td>

      <td>${order.userId || "-"}</td>

      <td>${order.customerName || "-"}</td>

      <td>${order.phone || "-"}</td>

      <td>${order.address || "-"}</td>

      <td>${order.status || "Pending"}</td>

      <td>
        ${new Date(
          order.createdAt
        ).toLocaleDateString()}
      </td>

<td>
  <button onclick="viewOrder('${order._id}')">
    View
  </button>
</td>

<td>
  <button onclick="printLabel('${order._id}')">
    🖨 Print
  </button>
</td>


    `;

    table.appendChild(row);

  });

}

// VIEW ORDER
async function viewOrder(id) {

  const res = await fetch(
    `${API}/${id}`,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("adminToken")
      }
    }
  );

const data = await res.json();
const order = data.order;

console.log(order);


  console.log("VIEW ORDER =", order);  

  let badgeClass =
    "pending";

  if (
    order.status ===
    "Delivered"
  ) {
    badgeClass =
      "delivered";
  }

  if (
    order.status ===
    "Cancelled"
  ) {
    badgeClass =
      "cancelled";
  }

  const discount =
    (order.mrp || 0) -
    (order.sellingPrice || 0);

  document.getElementById(
    "orderDetails"
  ).innerHTML = `

<div class="order-header">

<h3>
${order.orderId}
</h3>

<div class="status-badge ${badgeClass}">
${order.status}
</div>

</div>

<div class="customer-box">

<h3>
Customer Details
</h3>

<p>
<b>Name:</b>
${order.customerName}
</p>

<p>
<b>Phone:</b>
${order.phone}
</p>

<p>
<b>Address:</b>
${order.address}
</p>

<p>
<b>Date:</b>
${new Date(
  order.createdAt
).toLocaleString()}
</p>

</div>

<div class="product-card">

<img
src="${order.productImage}"
class="product-image"
/>

<div class="product-info">

<div class="product-name">
${order.productName}
</div>

<div class="size-box">
Size :
${order.size}
</div>

<div class="price-row">
<span>MRP</span>
<span>
₹${order.mrp}
</span>
</div>

<div class="price-row">
<span>Selling Price</span>
<span>
₹${order.sellingPrice}
</span>
</div>

<div class="price-row discount">
<span>Discount</span>
<span>
₹${discount}
</span>
</div>

<div class="price-row">
<span>Total Amount</span>
<span>
₹${order.totalAmount}
</span>
</div>

</div>

</div>

<div class="payment-box">

<h3>
Payment Details
</h3>

<p>
<b>Method:</b>
${order.paymentMethod || "N/A"}
</p>

<p>
<b>Status:</b>
${order.paymentStatus || "N/A"}
</p>

</div>

<div class="action-buttons">

<select
id="statusSelect"
style="
padding:10px;
border-radius:8px;
margin-right:10px;
"
>

<option value="Pending">Pending</option>

<option value="Accepted">Accepted</option>

<option value="Packing">Packing</option>

<option value="Packed">Packed</option>

<option value="Out for Delivery">
Out for Delivery
</option>

<option value="Delivered">
Delivered
</option>

<option value="Cancelled">
Cancelled
</option>

</select>

<button
class="accept-btn"
onclick="
updateStatus(
'${order._id}',
document.getElementById('statusSelect').value
)"
>
Update Status
</button>

</div>

`;

  document.getElementById(
    "orderPopup"
  ).style.display =
    "block";

}

// UPDATE STATUS
async function updateStatus(
  id,
  status
) {

  await fetch(
    `${API}/${id}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          "Bearer " +
          localStorage.getItem(
            "adminToken"
          )
      },

      body: JSON.stringify({
        status
      })
    }
  );

  alert(
    "Status Updated"
  );

  closePopup();

  getOrders();

}

// CLOSE POPUP
function closePopup() {

  document.getElementById(
    "orderPopup"
  ).style.display =
    "none";

}

async function printLabel(id) {

  const res = await fetch(`${API}/${id}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    }
  });

const data = await res.json();
const order = data.order;

const customerName =
  order.customerName || "-";

const phone =
  order.phone || "-";

const address =
  order.address || "-";

const paymentMethod =
order.paymentMethod || "Cash On Delivery";

const isCOD =
paymentMethod.toLowerCase().includes("cash");

let paymentHTML = "";

if (isCOD) {

  paymentHTML = `
    <div class="line payment-box">
      Payment: COD
    </div>

    <div class="line payment-box">
      COLLECT ₹${order.totalAmount || 0}
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
  Total: ₹${order.totalAmount || 0}
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

// LOAD
getOrders();