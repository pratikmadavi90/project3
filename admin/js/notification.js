const API = "http://localhost:5000/api/notification";

async function sendNotification() {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;

  const res = await fetch(`${API}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, message }),
  });

  const data = await res.json();
  alert(data.msg);
}