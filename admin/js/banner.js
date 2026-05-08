const BASE_URL = "http://localhost:5000";

let currentIndex = 0;
let sliderInterval = null;

// 🚀 ADD BANNER
async function addBanner() {
  const title = document.getElementById("title").value;
  const type = document.getElementById("type").value;
  const redirectTypeEl = document.getElementById("redirectType");
  const redirectValueEl = document.getElementById("redirectValue");
  const file = document.getElementById("image").files[0];

  // ✅ Safe handling (agar field nahi mile to error na aaye)
  const redirectType = redirectTypeEl ? redirectTypeEl.value : "";
  const redirectValue = redirectValueEl ? redirectValueEl.value : "";

  if (!file) return alert("Select image");

  try {
    // 1️⃣ Upload to S3
    const formData = new FormData();
    formData.append("image", file);

    const uploadRes = await fetch(`${BASE_URL}/upload`, {
  method: "POST",
  body: formData
});

    const uploadData = await uploadRes.json();

    if (!uploadData.imageUrl) {
      alert("❌ Upload failed");
      return;
    }

    // 📦 Save banner in DB
    const saveRes = await fetch(`${BASE_URL}/add-banner`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
      body: JSON.stringify({
        title,
        type,
        image: uploadData.imageUrl,
        position: Date.now(),
        isActive: true,
        redirectType,   // ✅ NEW
        redirectValue   // ✅ NEW
      })
    });

    const saveData = await saveRes.json();

    if (saveData.success) {
      alert("✅ Banner Added");

      // reset fields
      document.getElementById("title").value = "";
      document.getElementById("image").value = "";
      if (redirectValueEl) redirectValueEl.value = "";

      loadBanners();
    } else {
      alert("❌ Save failed");
    }

  } catch (err) {
    console.error(err);
    alert("❌ Error adding banner");
  }
}

// 🚀 LOAD BANNERS
async function loadBanners() {
  try {
    const res = await fetch(`${BASE_URL}/banners`);
    const data = await res.json();

    const slider = document.getElementById("sliderPreview");
    const small = document.getElementById("smallPreview");

    slider.innerHTML = "";
    small.innerHTML = "";

    data.forEach((b) => {
      if (b.type === "slider") {
        slider.innerHTML += `
          <div class="banner-card">
            <img src="${b.image}" />
            <button class="delete-btn" onclick="deleteBanner('${b._id}')">X</button>
          </div>
        `;
      } else {
        small.innerHTML += `
          <div class="small-box">
            <img src="${b.image}" />
            <button onclick="deleteBanner('${b._id}')">X</button>
          </div>
        `;
      }
    });

  } catch (err) {
    console.error("Load error:", err);
    alert("❌ Error loading banners");
  }
}

// 🚀 DELETE BANNER
async function deleteBanner(id) {
  if (!confirm("Delete banner?")) return;

  try {
    const res = await fetch(`${BASE_URL}/delete-banner/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      alert("🗑️ Deleted");
      loadBanners();
    } else {
      alert("❌ Delete failed");
    }

  } catch (err) {
    console.error("Delete error:", err);
    alert("❌ Error deleting");
  }
}

// 🚀 PAGE LOAD
window.onload = loadBanners;