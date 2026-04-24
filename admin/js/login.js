const BASE_URL = "https://api.harzo.in";

// MESSAGE
function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.style.display = "block";
  msg.className = "message " + type;
  msg.innerText = text;
}

// SEND OTP
window.sendOTP = async function() {
  const email = document.getElementById("email").value;

  if (!email) {
    showMessage("Enter email", "error");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    showMessage("OTP sent", "success");

  } catch (err) {
    showMessage("Server error", "error");
  }
};

// ✅ VERIFY OTP (FINAL FIXED)
window.verifyOTP = async function () {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  if (!otp) {
    showMessage("Enter OTP", "error");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    console.log("VERIFY RESPONSE:", data);



   // ✅ BEST CONDITION (IMPORTANT)
if (data.success || data.message?.toLowerCase().includes("success")) {

  showMessage("Login Successful 🚀", "success");

  // ✅ LOGIN FLAG
  localStorage.setItem("isAdminLoggedIn", "true");

  // ✅ REDIRECT (ONLY ONE)
 setTimeout(() => {
  window.location.replace("/pages/products.html");
}, 800);

} else {
  showMessage(data.message || "Invalid OTP", "error");
}

  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    showMessage("Server error", "error");
  }
}