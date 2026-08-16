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

    const response =
      await fetch(
        `${API}/add`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
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
            product.images &&
            product.images.length
              ? `
            <img
              src="${product.images[0]}"
              class="product-image"
            >
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
      `${API}/${id}`,
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