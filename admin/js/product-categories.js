const API =
  "https://api.harzo.in/api/product-categories";

  const token = localStorage.getItem("token");

const categoriesContainer =
  document.getElementById("categoriesContainer");

const categoryName =
  document.getElementById("categoryName");

const categoryImage =
  document.getElementById("categoryImage");

const categoryId =
  document.getElementById("categoryId");

const saveCategoryBtn =
  document.getElementById("saveCategoryBtn");


// Load Categories
async function loadCategories() {

  try {

    const res = await fetch(API, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    const data = await res.json();

     console.log(data);

    categoriesContainer.innerHTML = "";

    data.categories.forEach(category => {

      const card =
        document.createElement("div");

      card.className = "category-card";

      card.innerHTML = `
      
        <img
          src="${category.image}"
          alt="${category.name}"
        >

        <h3>${category.name}</h3>

        <div class="card-actions">

          <button
            class="products-btn"
            onclick="openProducts('${category._id}')"
          >
            Products
          </button>

          <button
            class="edit-btn"
            onclick="editCategory('${category._id}')"
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
      `;

      categoriesContainer.appendChild(card);

    });

  } catch (error) {
    console.error(error);
  }
}


// Save Category
saveCategoryBtn.addEventListener(
  "click",
  async () => {

    try {

      const formData =
        new FormData();

      formData.append(
        "name",
        categoryName.value
      );

      if (
        categoryImage.files[0]
      ) {
        formData.append(
          "image",
          categoryImage.files[0]
        );
      }

      let url = `${API}/add`;
      let method = "POST";

      if (
        categoryId.value
      ) {
        url =
          `${API}/${categoryId.value}`;

        method = "PUT";
      }

const res =
  await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

      const data =
        await res.json();

      alert(data.message);

      categoryId.value = "";
      categoryName.value = "";
      categoryImage.value = "";

      loadCategories();

    } catch (error) {
      console.error(error);
    }

  }
);


// Edit Category
async function editCategory(id) {

  try {

const res =
  await fetch(
    `${API}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

    const data =
      await res.json();

    categoryId.value =
      data.category._id;

    categoryName.value =
      data.category.name;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } catch (error) {
    console.error(error);
  }
}


// Delete Category
async function deleteCategory(id) {

  const confirmNumber = prompt(
    "Delete karne ke liye mobile number enter karo"
  );

  if (confirmNumber !== "9373694729") {
    alert("Wrong Number. Delete Cancelled.");
    return;
  }

  try {

    const res = await fetch(
      `${API}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    alert(data.message);

    loadCategories();

  } catch (error) {
    console.error(error);
  }
}


// Open Products
function openProducts(id) {

  window.location.href =
    `all-products.html?categoryId=${id}`;
}


// Initial Load
loadCategories();