const params = new URLSearchParams(window.location.search);
const categoryId = params.get("categoryId");

const API = categoryId
  ? `https://api.harzo.in/api/all-products/category/${categoryId}`
  : "https://api.harzo.in/api/all-products";

const token = localStorage.getItem("token");

const productsContainer = document.getElementById("productsContainer");

const modal = document.getElementById("productModal");

const closeBtn = document.querySelector(".close-btn");

async function loadProducts() {
  try {

    const res = await fetch(API, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const data = await res.json();
const products = data.products || [];

    productsContainer.innerHTML = "";

    products.forEach(product => {

      const image =
        product.images?.length > 0
          ? product.images[0]
          : "https://via.placeholder.com/200";

      const card = document.createElement("div");

      card.className = "product-card";

      card.innerHTML = `
      
        <img src="${image}" class="product-image">

        <h3>${product.name}</h3>

      <p class="price">₹${product.sellingPrice}</p>

        <div class="card-buttons">

          <button
            class="edit-btn"
            onclick="editProduct('${product._id}')"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteProduct('${product._id}')"
          >
            Delete
          </button>

        </div>
      `;

      card.addEventListener("click", () => {
        openModal(product);
      });

      productsContainer.appendChild(card);

    });

  } catch (error) {
    console.error(error);
  }
}

function openModal(product) {

  document.getElementById("modalName").innerText =
    product.name || "";

  document.getElementById("modalCategory").innerText =
    product.category?.name || "";

  document.getElementById("modalSubCategory").innerText =
    product.subCategory || "";

  document.getElementById("modalMrp").innerText =
    product.mrp || "";

document.getElementById("modalPrice").innerText =
  product.sellingPrice || "";

  document.getElementById("modalWeight").innerText =
    product.weight || "";

  document.getElementById("modalStock").innerText =
    product.stock || "";

  document.getElementById("modalDescription").innerText =
    product.description || "";

  const imagesDiv =
    document.getElementById("modalImages");

  imagesDiv.innerHTML = "";

  if (product.images) {

    product.images.forEach(img => {

      imagesDiv.innerHTML += `
        <img
          src="${img}"
          class="modal-image"
        >
      `;

    });

  }

  modal.style.display = "flex";
}

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

function editProduct(id) {

  window.location.href =
    `add-product.html?id=${id}`;
}

async function deleteProduct(id) {

  if (!confirm("Delete Product?")) return;

  try {

await fetch(`${API}/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    loadProducts();

  } catch (error) {
    console.error(error);
  }
}

const addProductBtn =
  document.getElementById("addProductBtn");

if (addProductBtn) {

  addProductBtn.addEventListener("click", () => {

    window.location.href =
      `add-product.html?categoryId=${categoryId}`;

  });

}

loadProducts();