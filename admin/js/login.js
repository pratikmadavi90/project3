// ✅ MESSAGE SHOW FUNCTION
function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.style.display = "block";
  msg.className = "message " + type;
  msg.innerText = text;
}

// ✅ SEND OTP
async function sendOTP() {
  const email = document.getElementById("email").value;

  if (!email) {
    showMessage("Enter email", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/admin/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    console.log("SEND OTP RESPONSE:", data); // debug

    if (data.success || data.message?.toLowerCase().includes("sent")) {
      showMessage("OTP sent successfully ✅", "success");
    } else {
      showMessage(data.message || "OTP failed", "error");
    }

  } catch (err) {
    console.log(err);
    showMessage("Server error", "error");
  }
}

// ✅ VERIFY OTP (FINAL FIXED)
async function verifyOTP() {
    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;

    if (!otp) {
        showMessage("Enter OTP", "error");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/admin/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();
        console.log("VERIFY RESPONSE:", data);

      if (data.success || data.message?.toLowerCase().includes("success")) {
  showMessage("Login Successful 🚀", "success");

  // 🔥 IMPORTANT FIX
  localStorage.setItem("isLoggedIn", "true");



           // LOGIN SUCCESS

localStorage.setItem("isAdminLoggedIn", "true");


            setTimeout(() => {
                window.location.href = "/admin/pages/dashboard.html";
            }, 500);

        } else {
            showMessage(data.message || "Invalid OTP", "error");
        }

    } catch (err) {
        console.log(err);
        showMessage("Server error", "error");
    }
}