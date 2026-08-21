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
        <button
          onclick="viewOrder('${order._id}')"
        >
          View
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
Payment Method
</h3>

<p>
${order.paymentMethod}
</p>

</div>

<div class="action-buttons">

<button
class="accept-btn"
onclick="
updateStatus(
'${order._id}',
'Accepted'
)"
>
Accept Order
</button>

<button
class="delivered-btn"
onclick="
updateStatus(
'${order._id}',
'Delivered'
)"
>
Delivered
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

// LOAD
getOrders();