const token = localStorage.getItem("adminToken");

const API =
  "https://api.harzo.in/api/footwear/products";

const params =
  new URLSearchParams(window.location.search);

const categoryId =
  params.get("categoryId");

const productsGrid =
  document.getElementById("productsGrid");

const saveBtn =
  document.getElementById("saveBtn");

 editingProductId = null;
saveBtn.textContent = "Add Product";

 const categorySelect =
  document.getElementById("category"); 

loadCategories();
loadProducts();

saveBtn.addEventListener(
  "click",
  addProduct
);

// ADD PRODUCT

async function addProduct() {
  try {
    const formData = new FormData();

formData.append(
  "category",
  categorySelect.value
);

    formData.append(
      "name",
      document.getElementById("name").value
    );

    formData.append(
      "brand",
      document.getElementById("brand").value
    );

    formData.append(
      "size",
      document.getElementById("size").value
    );

    formData.append(
      "mrp",
      document.getElementById("mrp").value
    );

    formData.append(
      "sellingPrice",
      document.getElementById("sellingPrice").value
    );

    formData.append(
      "stock",
      document.getElementById("stock").value
    );

    formData.append(
      "description",
      document.getElementById("description")
        .value
    );

    const files =
      document.getElementById("images")
        .files;

    for (let i = 0; i < files.length; i++) {
      formData.append(
        "images",
        files[i]
      );
    }

const url = editingProductId
  ? `${API}/update/${editingProductId}`
  : `${API}/add`;

const method = editingProductId
  ? "PUT"
  : "POST";

const response = await fetch(
  url,
  {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }
);

    const data =
      await response.json();

    alert(
      data.message ||
      "Product Added"
    );

    loadProducts();

  } catch (error) {
    console.error(error);
  }
}

async function loadCategories() {
  try {

    const res = await fetch(
      "https://api.harzo.in/api/footwear/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    categorySelect.innerHTML =
      '<option value="">Select Category</option>';

    data.categories.forEach((cat) => {

      categorySelect.innerHTML += `
        <option value="${cat._id}">
          ${cat.name}
        </option>
      `;

    });

  } catch (error) {
    console.error(error);
  }
}

// LOAD PRODUCTS

async function loadProducts() {
  try {

    const response =
      await fetch(
        `${API}/category/${categoryId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    productsGrid.innerHTML = "";

    data.products.forEach(
      (product) => {

        productsGrid.innerHTML += `
        
        <div class="product-card">

          <h3>${product.name}</h3>

          <div class="product-info">

            <b>Brand :</b>
            ${product.brand}<br>

            <b>Size :</b>
            ${product.size}<br>

            <b>MRP :</b>
            ₹${product.mrp}<br>

            <b>Selling :</b>
            ₹${product.sellingPrice}<br>

            <b>Stock :</b>
            ${product.stock}

          </div>

          <div class="product-description">
            <b>Description :</b><br>
            ${product.description}
          </div>

${
  product.images && product.images.length
    ? `
      <div class="product-images">
        ${product.images
          .map(
            (img) => `
              <img
                src="${img}"
                class="product-image"
              >
            `
          )
          .join("")}
      </div>
    `
    : ""
}
          <div class="product-actions">

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

        </div>

        `;
      }
    );
    
  } catch (error) {
    console.error(error);
  }
}

async function deleteProduct(id) {

  try {

    const response = await fetch(
      `${API}/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    loadProducts();

  } catch (error) {
    console.error(error);
  }

}


async function editProduct(id) {

  const response = await fetch(
    `${API}/category/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  const product = data.products.find(
    (p) => p._id === id
  );

  if (!product) return;

  editingProductId = id;

  document.getElementById("name").value =
    product.name || "";

  document.getElementById("brand").value =
    product.brand || "";

  document.getElementById("size").value =
    Array.isArray(product.size)
      ? product.size.join(",")
      : product.size;

  document.getElementById("mrp").value =
    product.mrp || "";

  document.getElementById("sellingPrice").value =
    product.sellingPrice || "";

  document.getElementById("stock").value =
    product.stock || "";

  document.getElementById("description").value =
    product.description || "";

  categorySelect.value =
    product.category._id;

  saveBtn.textContent =
    "Update Product";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}