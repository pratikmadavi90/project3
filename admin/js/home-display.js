const API = "https://api.harzo.in/api";

let allProducts = [];

// LOAD PRODUCTS
async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const data = await res.json();

    allProducts = data;

    fillAllDropdowns();
    loadSavedSections();

  } catch (err) {
    console.log(err);
  }
}

// FILL DROPDOWNS
function fillDropdown(id) {
  const select = document.getElementById(id);

  if (!select) return;

  select.innerHTML =
    `<option value="">Select Product</option>`;

  allProducts.forEach((product) => {
    select.innerHTML += `
      <option value="${product._id}">
        ${product.name}
      </option>
    `;
  });
}

// ALL DROPDOWNS
function fillAllDropdowns() {

  [
    "daily1","daily2","daily3","daily4",

    "chips1","chips2","chips3","chips4",

    "drinks1","drinks2","drinks3","drinks4",

    "dairy1","dairy2","dairy3","dairy4",

    "pc1","pc2","pc3","pc4",
    "pc5","pc6","pc7","pc8",

    "hh1","hh2","hh3","hh4",
    "hh5","hh6","hh7","hh8",

  ].forEach(fillDropdown);
}

// SAVE SECTION
async function saveSection(section) {

  let ids = [];

  if (section === "Daily Grocery") {
    ids = [
      daily1.value,
      daily2.value,
      daily3.value,
      daily4.value,
    ];
  }

  else if (section === "Chips & Namkeen") {
    ids = [
      chips1.value,
      chips2.value,
      chips3.value,
      chips4.value,
    ];
  }

  else if (section === "Drinks") {
    ids = [
      drinks1.value,
      drinks2.value,
      drinks3.value,
      drinks4.value,
    ];
  }

  else if (section === "Dairy, Bread & Eggs") {
    ids = [
      dairy1.value,
      dairy2.value,
      dairy3.value,
      dairy4.value,
    ];
  }

  else if (section === "Personal Care") {
    ids = [
      pc1.value,
      pc2.value,
      pc3.value,
      pc4.value,
      pc5.value,
      pc6.value,
      pc7.value,
      pc8.value,
    ];
  }

  else if (section === "Household") {
    ids = [
      hh1.value,
      hh2.value,
      hh3.value,
      hh4.value,
      hh5.value,
      hh6.value,
      hh7.value,
      hh8.value,
    ];
  }

  ids = ids.filter(Boolean);

  try {

    const res = await fetch(
      `${API}/home-display/save`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          section,
          products: ids,
          isActive: true,
        }),
      }
    );

    const result =
      await res.json();

    alert(result.message);

  } catch (err) {
    console.log(err);
    alert("Save Failed");
  }
}

// LOAD SAVED DATA
async function loadSavedSections() {

  try {

    const res = await fetch(
      `${API}/home-display`
    );

    const sections =
      await res.json();

    console.log(
      "HOME DISPLAY:",
      sections
    );

  } catch (err) {
    console.log(err);
  }
}

loadProducts();