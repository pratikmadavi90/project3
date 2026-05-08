const API = "https://api.harzo.in/api/notification";

async function sendNotification() {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;

  try {
    const res = await fetch(`${API}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Notification failed");
    }

    alert(data.msg || "Notification sent");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}