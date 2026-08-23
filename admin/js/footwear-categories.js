const API =
  "https://api.harzo.in/api/footwear/categories";

const token =
  localStorage.getItem("adminToken");

const categoriesGrid =
  document.getElementById("categoriesGrid");

document
  .getElementById("addCategoryBtn")
  .addEventListener("click", addCategory);

loadCategories();

// Load Categories
async function loadCategories() {
  try {
    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) return;

    categoriesGrid.innerHTML = "";

data.categories.forEach((category) => {
  categoriesGrid.innerHTML += `
    <div class="category-card">

<h3>${category.name}</h3>

<p>
  <b>Order:</b>
  ${category.displayOrder || 0}
</p>

      <div class="category-actions">

        <button
          class="products-btn"
          onclick="openCategory('${category._id}')"
        >
          Products
        </button>

        <button
          class="edit-btn"
          onclick="editCategory('${category._id}','${category.name}')"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="deleteCategory('${category._id}')"
        >
          Delete
        </button>

      </div>

    </div>
  `;
});

  } catch (error) {
    console.error(error);
  }
}

// Add Category
async function addCategory() {

const displayOrder = prompt(
  "Enter Display Order",
  "0"
);

  if (!name) return;

  try {

    const response =
      await fetch(
        `${API}/add`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

body: JSON.stringify({
  name,
  displayOrder,
}),
        }
      );

    const data =
      await response.json();

    alert(
      data.message ||
      "Category Added"
    );

    loadCategories();

  } catch (error) {
    console.error(error);
  }
}

// Edit Category
async function editCategory(
  id,
  oldName
) {

  const name = prompt(
    "Edit Category",
    oldName
  );

 const displayOrder = prompt(
  "Edit Display Order",
  "0"
); 

  if (!name) return;

  try {

    const response =
      await fetch(
        `${API}/update/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

body: JSON.stringify({
  name,
  displayOrder,
}),
        }
      );

    const data =
      await response.json();

    alert(
      data.message ||
      "Updated Successfully"
    );

    loadCategories();

  } catch (error) {
    console.error(error);
  }
}

// Delete Category
async function deleteCategory(id) {

  const confirmDelete =
    confirm(
      "Delete this category?"
    );

 const deleteCode = prompt(
  "Enter Delete Code"
);

if (deleteCode !== "9373352985") {

  alert("Invalid Delete Code");

  return;
}   

  if (!confirmDelete) return;

  try {

    const response =
      await fetch(
        `${API}/delete/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    alert(
      data.message ||
      "Deleted Successfully"
    );

    loadCategories();

  } catch (error) {
    console.error(error);
  }
}

// Open Product Page
function openCategory(id) {
  window.location.href =
    `footwear-products.html?categoryId=${id}`;
}