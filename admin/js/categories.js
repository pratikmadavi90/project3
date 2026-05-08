const BASE_URL = "http://localhost:5000/api";

// Load Categories
async function loadCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  const data = await res.json();

  const container = document.getElementById("categoryList");
  container.innerHTML = "";

  data.forEach(cat => {
    container.innerHTML += `
      <div>
        <h3>${cat.name}</h3>

        <img src="${cat.image}" width="60"/>

        ${cat.images.map(img => `<img src="${img}" width="40"/>`).join("")}

        <button onclick="editCategory('${cat._id}','${cat.name}')">Edit</button>
        <button onclick="deleteCategory('${cat._id}')">Delete</button>
      </div>
    `;
  });
}

// Add / Edit
document.getElementById("categoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value;

  const image = document.getElementById("image").files[0];
  const multipleImages = document.getElementById("multipleImages").files;

  const formData = new FormData();
  formData.append("name", name);

  if (image) formData.append("image", image);

  for (let i = 0; i < multipleImages.length; i++) {
    formData.append("images", multipleImages[i]);
  }

  let url = `${BASE_URL}/categories`;
  let method = "POST";

  if (id) {
    url = `${BASE_URL}/categories/${id}`;
    method = "PUT";
  }

  await fetch(url, {
    method,
    body: formData
  });

  document.getElementById("categoryForm").reset();
  document.getElementById("editId").value = "";

  loadCategories();
});

// Edit
function editCategory(id, name) {
  document.getElementById("editId").value = id;
  document.getElementById("name").value = name;
}

// Delete
async function deleteCategory(id) {
  await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE"
  });
  loadCategories();
}

// CSV Upload
async function uploadCSV() {
  const file = document.getElementById("csvFile").files[0];

  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${BASE_URL}/categories/csv`, {
    method: "POST",
    body: formData
  });

  loadCategories();
}

// Init
loadCategories();