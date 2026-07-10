const API = "https://api.harzo.in/api/delivery-boy";
const TOKEN = localStorage.getItem("adminToken");

// Dashboard
async function loadDashboard() {

  try {

    const res = await fetch(`${API}/admin-dashboard`, {
      headers: {
        Authorization: "Bearer " + TOKEN
      }
    });

    const data = await res.json();

    if (!data.success) return;

    document.getElementById("totalBoys").innerText =
      data.totalDeliveryBoys;

    document.getElementById("onlineBoys").innerText =
      data.onlineDeliveryBoys;

    document.getElementById("todayDelivered").innerText =
      data.todayDelivered;

    document.getElementById("todayPending").innerText =
      data.todayPending;

    document.getElementById("todayCancelled").innerText =
      data.todayCancelled;

    document.getElementById("todayEarnings").innerText =
      "₹" + data.todayEarnings;

    document.getElementById("weekEarnings").innerText =
      "₹" + data.weekEarnings;

    document.getElementById("monthEarnings").innerText =
      "₹" + data.monthEarnings;

  } catch (err) {

    console.log(err);

  }

}

// Top Performers

async function loadTopPerformers() {

  try {

    const res = await fetch(`${API}/top-performers`, {

      headers: {
        Authorization: "Bearer " + TOKEN
      }

    });

    const result = await res.json();

    const tbody =
      document.getElementById("performerList");

    tbody.innerHTML = "";

    result.data.forEach((boy, index) => {

      tbody.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>${boy.name}</td>

<td>${boy.todayDelivered}</td>

<td>${boy.weekDelivered}</td>

<td>${boy.monthDelivered}</td>

<td>${boy.totalDelivered}</td>

<td>₹${boy.todayEarning}</td>

<td>₹${boy.monthEarning}</td>

<td>

${boy.online

? "<span style='color:#48ff3d'>Online</span>"

: "<span style='color:red'>Offline</span>"}

</td>

<td>

<button
onclick="viewDetails('${boy.deliveryId}')">

View

</button>

</td>

</tr>

`;

    });

  } catch (err) {

    console.log(err);

  }

}

// Search

document.getElementById("search")
.addEventListener("keyup", () => {

  const value =
    document.getElementById("search")
    .value
    .toLowerCase();

  const rows =
    document.querySelectorAll("#performerList tr");

  rows.forEach(row => {

    row.style.display =

      row.innerText
      .toLowerCase()
      .includes(value)

      ? ""

      : "none";

  });

});

// Refresh

function refreshPage() {

  loadDashboard();

  loadTopPerformers();

  loadWeeklyChart();

  loadMonthlyEarnings();

}



// =========================
// DELIVERY BOY DETAILS
// =========================

async function viewDetails(deliveryBoyId){

try{

const res = await fetch(

`${API}/details/${deliveryBoyId}`,

{
headers:{
Authorization:"Bearer "+TOKEN
}
}

);

const result = await res.json();

if(!result.success){
return;
}

const d = result.deliveryBoy;
const p = result.performance;

document.getElementById("details").innerHTML = `

<div style="grid-column:1/-1;text-align:center;">
  <h2>${d.name}</h2>
</div>

<p><b>Delivery ID:</b> ${d.deliveryId}</p>

<p><b>Mobile:</b> ${d.mobile}</p>

<p><b>Vehicle:</b> ${d.vehicle}</p>

<p><b>Status:</b> ${d.status}</p>

<p><b>Online:</b>

${d.online

? "🟢 Online"

: "🔴 Offline"}

</p>



<p><b>Today Delivered:</b> ${p.todayDelivered}</p>
<p><b>Today Pending:</b> ${p.todayPending}</p>

<p><b>Today Cancelled:</b> ${p.todayCancelled}</p>
<p><b>Today Earnings:</b> ₹${p.todayEarning}</p>

<p><b>Week Delivered:</b> ${p.weekDelivered}</p>
<p><b>Week Earnings:</b> ₹${p.weekEarning}</p>

<p><b>Month Delivered:</b> ${p.monthDelivered}</p>
<p><b>Month Earnings:</b> ₹${p.monthEarning}</p>

<p><b>Total Delivered:</b> ${p.totalDelivered}</p>
<p><b>Total Pending:</b> ${p.pendingOrders}</p>

<p><b>Total Cancelled:</b> ${p.cancelledOrders}</p>
<p><b>Total Earnings:</b> ₹${p.totalEarning}</p>

`;

document.getElementById(
"detailModal"
).style.display="flex";

}catch(err){

console.log(err);

}

}

function closeModal(){

document.getElementById(
"detailModal"
).style.display="none";

}

// =========================
// WEEKLY CHART
// =========================

let weeklyChart;

async function loadWeeklyChart(){

try{

const res = await fetch(

`${API}/weekly-chart`,

{
headers:{
Authorization:"Bearer "+TOKEN
}
}

);

const result = await res.json();

const labels =
result.chart.map(x=>x.day);

const values =
result.chart.map(x=>x.delivered);

if(weeklyChart){

weeklyChart.destroy();

}

weeklyChart =
new Chart(

document.getElementById(
"weeklyChart"
),

{

type:"bar",

data:{

labels,

datasets:[{

label:"Delivered",

data:values

}]

}

}

);

}catch(err){

console.log(err);

}

}

// =========================
// MONTHLY EARNINGS
// =========================

let monthlyChart;

async function loadMonthlyEarnings(){

try{

const res = await fetch(

`${API}/monthly-earnings`,

{
headers:{
Authorization:"Bearer "+TOKEN
}
}

);

const result = await res.json();

const labels =
result.data.map(x=>x.week);

const values =
result.data.map(x=>x.earning);

if(monthlyChart){

monthlyChart.destroy();

}

monthlyChart =
new Chart(

document.getElementById(
"monthlyChart"
),

{

type:"line",

data:{

labels,

datasets:[{

label:"Earnings",

data:values

}]

}

}

);

}catch(err){

console.log(err);

}

}

// Auto Load

refreshPage();