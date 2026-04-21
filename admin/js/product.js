
document.addEventListener("DOMContentLoaded", () => {
  getProducts();
});

let allProducts = [];
let editId = null;

const BASE_URL = "http://localhost:5000";

// 👉 ADD / UPDATE PRODUCT
async function addOrUpdateProduct() {

const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const subCategorySelect = document.getElementById("subCategory");
const subCategoryInput = document.getElementById("subCategoryInput");;
const brandInput = document.getElementById("brand");
const mrpInput = document.getElementById("mrp");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const weightInput = document.getElementById("weight");
const descriptionInput = document.getElementById("description");

  const files = document.getElementById("images").files;

  const formData = new FormData();

 formData.append("name", nameInput.value);
formData.append("category", categoryInput.value);
formData.append("brand", brandInput.value);
formData.append("subCategory", subCategoryInput.value);
formData.append("mrp", mrpInput.value);
formData.append("price", priceInput.value);
formData.append("stock", stockInput.value);
formData.append("weight", weightInput.value);
formData.append("description", descriptionInput.value);

  // 🔥 IMAGE FIX (DIRECT S3 UPLOAD)
  if (files.length > 6) {
    alert("Max 6 images allowed");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]); // ✅ correct
  }


  // 👉 API CALL
  if (editId) {
    await fetch(`${BASE_URL}/api/products/update/${editId}`, {
      method: "PUT",
      body: formData
    });
    editId = null;
  } else {
    await fetch(`${BASE_URL}/api/products/add`, {
      method: "POST",
      body: formData
    });
  }

clearForm();

 await getProducts();
}

document.getElementById("saveBtn").innerText = "Save Product";

// 🔥 DELETE FUNCTION
async function deleteProduct(id) {
  try {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    });

    alert("Product deleted ✅");

    loadProducts(document.getElementById("category")?.value || "grocery");

  } catch (error) {
    console.error("Delete error:", error);
  }
}

// 👇 VERY IMPORTANT
window.deleteProduct = deleteProduct;

function editProduct(id) {
  const product = allProducts.find(p => p._id === id);

console.log(product);

  if (!product) return;

  editId = product._id;

  document.getElementById("name").value = product.name || "";
  document.getElementById("category").value = product.category || "";
  document.getElementById("brand").value = product.brand || "";

  document.getElementById("mrp").value = product.pricing?.mrp || "";
  document.getElementById("price").value = product.pricing?.price || "";
  document.getElementById("stock").value = product.stock?.quantity || "";

  document.getElementById("weight").value = product.weight || "";
  document.getElementById("description").value = product.description || "";

  document.getElementById("saveBtn").innerText = "Update Product";
}

window.editProduct = editProduct;

function cancelEdit() {
  editId = null;

  document.getElementById("saveBtn").innerText = "Save Product";

  // form clear
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("mrp").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("description").value = "";
}

// 👉 LOAD PRODUCTS
async function loadProducts(category) {
  const res = await fetch(`${BASE_URL}/api/products?category=${category}`);
  const data = await res.json();

  console.log("Category:", category, data);

  allProducts = data;
  displayProducts(data);
}


// 👉 DISPLAY PRODUCTS
function displayProducts(data) {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const selectedCategory = document.getElementById("filterCategory")?.value || "";

  data
    .filter(p =>
      selectedCategory === "" ||
      p.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    )
    .forEach(p => {

      console.log("FULL PRODUCT:", p);
console.log("WEIGHT VALUE:", p.weight);

      // ✅ weight fix
      const weight =
        typeof p.weight === "object"
          ? p.weight?.value
          : p.weight;

      // ✅ stock fix
      const stock =
        typeof p.stock === "object"
          ? p.stock?.quantity
          : p.stock;

      // 🔥 IMAGE FIX
      let images = [];

      if (Array.isArray(p.images)) {
        images = p.images;
      } else if (typeof p.images === "string") {
        try {
          images = JSON.parse(p.images);
        } catch {
          images = [];
        }
      } else if (p.images?.gallery) {
        images = p.images.gallery;
      } else if (p.images?.thumbnail) {
        images = [p.images.thumbnail];
      }

      let imageHTML = "";

      if (images.length > 0) {
        imageHTML = images.map(img => {
          if (typeof img === "object" && img.url) {
            return `<img src="${img.url}" style="width:100%;height:120px;object-fit:cover;">`;
          } else {
            return `<img src="${img}" style="width:100%;height:120px;object-fit:cover;">`;
          }
        }).join("");
      } else {
        imageHTML = `<img src="https://via.placeholder.com/150">`;
      }

      // ✅ FINAL CARD (ONLY ONCE)
      list.innerHTML += `
      <div class="card">

        <div class="slider-container">
          <div class="slider">
            ${imageHTML}
          </div>
        </div>

        <b>${p.name || "No Name"}</b><br>
        ${p.category || ""} | ${p.subCategory || ""}<br>

        <del>₹${p.pricing?.mrp || 0}</del> ₹${p.pricing?.sellingPrice || 0}<br>

        Weight: ${weight || "N/A"}<br>
        Stock: ${stock || 0}<br>

        <div class="btns">
          <button onclick="editProduct('${p._id}')">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </div>

      </div>
      `;
    });
}

window.slideRight = function(btn) {
  const slider = btn.parentElement.querySelector('.slider');
  const width = slider.clientWidth;
  slider.scrollBy({ left: width, behavior: "smooth" });
}
window.slideLeft = function(btn) {
  const slider = btn.parentElement.querySelector('.slider');
  const width = slider.clientWidth;
  slider.scrollBy({ left: -width, behavior: "smooth" });
}




// 👉 CLEAR FORM
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("mrp").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("description").value = "";
}

async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();

    console.log("PRODUCT DATA:", data);

    displayProducts(data);
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// 🔥 Filter change pe auto load
document.getElementById("filterCategory").addEventListener("change", function () {
  loadProducts(this.value);
});


document.addEventListener("DOMContentLoaded", () => {

  const categories = [
    "Grocery",
    "Snacks",
    "Beverages",
    "Dairy",
    "Personal Care",
    "Household"
  ];

  // 🔹 Category dropdown
  const category = document.getElementById("category");
  if (category) {
    category.innerHTML = `<option value="">Select Category</option>`;
    categories.forEach(cat => {
      category.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
  }

  // 🔹 Filter dropdown
  const filter = document.getElementById("filterCategory");
  if (filter) {
    filter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach(cat => {
      filter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
  }

  // 🔥 SUBCATEGORY DATA
  const subcategories = {

    Snacks: [
      "Chips","Namkeen","Bhujia & Mixtures","Biscuits","Cookies",
      "Cream Biscuits","Crackers","Rusk & Toast","Instant Noodles",
      "Pasta & Macaroni","Vermicelli","Ready Meals","Frozen Snacks",
      "Popcorn","Nachos","Khakhra","Papad","Energy Bars",
      "Chocolates","Candies & Toffees","Chewing Gum"
    ],

    Grocery: [
      "Atta","Rice","Dal","Cooking Oil","Ghee",
      "Whole Spices","Powder Masala","Ready Masala","Salt",
      "Sugar","Jaggery","Honey","Dry Fruits","Seeds","Pickles",
      "Chutney","Sauces & Ketchup","Vinegar","Baking Items",
      "Cornflour","Poha","Suji / Rava","Oats","Breakfast Cereals",
      "Peanut Butter","Jam & Spreads"
    ],

    Dairy: [
      "Milk","Curd","Paneer","Cheese","Butter","Ghee","Cream",
      "Condensed Milk","Flavoured Milk","Lassi","Buttermilk",
      "Milk Powder","Yogurt"
    ],

    Beverages: [
      "Soft Drinks","Fruit Juices","Packaged Water","Soda",
      "Energy Drinks","Sports Drinks","Tea","Coffee",
      "Health Drinks","Flavoured Milk Drinks","Cold Coffee",
      "Iced Tea","Syrups & Squash","Coconut Water"
    ],

    "Personal Care": [
      "Bath Soap","Body Wash","Shampoo","Conditioner","Hair Oil",
      "Hair Gel","Hair Color","Face Wash","Face Cream","Sunscreen",
      "Talcum Powder","Deodorant","Perfume","Toothpaste",
      "Toothbrush","Mouthwash","Shaving Cream","Razor",
      "Sanitary Pads","Tampons","Baby Care"
    ],

    "Household": [
  "Cleaning Supplies",
  "Detergents",
  "Dishwash",
  "Floor Cleaners",
  "Toilet Cleaners",
  "Glass Cleaners",
  "Drain Cleaners",
  "Phenyl",
  "Bleach",
  "Room Fresheners",
  "Air Freshener Spray",
  "Garbage Bags",
  "Aluminium Foil",
  "Cling Wrap",
  "Tissue Paper",
  "Paper Towels",
  "Mops & Brushes",
  "Brooms",
  "Buckets & Mugs",
  "Handwash",
  "Hand Sanitizer",
  "Insect Repellent",
  "Mosquito Coil / Liquid",
  "Matchbox",
  "Candles",
  "Pooja Items"
]

  };

  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("subCategory");
  const subCategoryInput = document.getElementById("subCategoryInput");

  if (categorySelect && subCategorySelect && subCategoryInput) {

    // 👉 Category change pe dropdown fill
    categorySelect.addEventListener("change", function () {

      const selected = this.value;

      subCategorySelect.innerHTML = `<option value="">Select Subcategory</option>`;

      if (subcategories[selected]) {
        subcategories[selected].forEach(sub => {
          subCategorySelect.innerHTML += `<option value="${sub}">${sub}</option>`;
        });
      }

    });

    // 👉 Dropdown select kare to input auto fill
    subCategorySelect.addEventListener("change", function () {
      subCategoryInput.value = this.value;
    });
  }

  // 🔥 PRODUCTS LOAD
  getProducts();

});