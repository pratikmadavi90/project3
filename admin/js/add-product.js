const token = localStorage.getItem("adminToken");

const BASE_URL = "https://api.harzo.in";

const categorySelect = document.getElementById("category");
const subCategory = document.getElementById("subCategory");

const params = new URLSearchParams(window.location.search);

const categoryId = params.get("categoryId");
const categoryName = params.get("categoryName");
const productId = params.get("id");


// Load Categories
async function loadCategories() {

    try {

        const res = await fetch(
            `${BASE_URL}/api/product-categories`
        );

        const data = await res.json();

        categorySelect.innerHTML =
            '<option value="">Select Category</option>';

        data.categories.forEach(cat => {

            categorySelect.innerHTML += `
                <option value="${cat._id}">
                    ${cat.name}
                </option>
            `;

        });

        if (categoryId) {
            categorySelect.value = categoryId;
        }

    } catch (error) {

        console.error(error);

    }

}


// Load Product For Edit
async function loadProductForEdit() {

    if (!productId) return;

    try {

        const res = await fetch(
            `${BASE_URL}/api/all-products/${productId}`
        );

        const data = await res.json();

        const product = data.product;

        document.getElementById("name").value =
            product.name || "";

        document.getElementById("mrp").value =
            product.mrp || "";

        document.getElementById("price").value =
            product.sellingPrice || "";

        document.getElementById("stock").value =
            product.stock || "";

         document.getElementById("maxOrderQuantity").value =
             product.maxOrderQuantity || 10;   

        document.getElementById("weight").value =
            product.weight || "";

        document.getElementById("description").value =
            product.description || "";

        document.getElementById("subCategory").value =
            product.subCategory || "";

        if (product.categoryId) {

            categorySelect.value =
                product.categoryId._id ||
                product.categoryId;

        }

        document.querySelector("button").innerText =
            "Update Product";

    } catch (error) {

        console.error(error);

    }

}


// Add / Update Product
async function addProduct() {

    try {

        const name =
            document.getElementById("name").value.trim();

        const mrp =
            document.getElementById("mrp").value;

        const sellingPrice =
            document.getElementById("price").value;

        const stock =
            document.getElementById("stock").value;

        const maxOrderQuantity =
             document.getElementById("maxOrderQuantity").value;    

        const weight =
            document.getElementById("weight").value;

        const description =
            document.getElementById("description").value;

        const files =
            document.getElementById("images").files;

        if (!name) {
            return alert("Enter Product Name");
        }

        if (!mrp) {
            return alert("Enter MRP");
        }

        if (!sellingPrice) {
            return alert("Enter Selling Price");
        }

        const formData = new FormData();

        formData.append(
            "categoryId",
            categorySelect.value
        );

        formData.append(
            "categoryName",
            localStorage.getItem("selectedCategoryName")
            || categoryName
            || ""
        );

        formData.append(
            "subCategory",
            subCategory.value
        );

        formData.append(
            "name",
            name
        );

        formData.append(
            "mrp",
            mrp
        );

        formData.append(
            "sellingPrice",
            sellingPrice
        );

        formData.append(
            "stock",
            stock
        );

        formData.append(
           "maxOrderQuantity",
           maxOrderQuantity
        );  

        formData.append(
            "weight",
            weight
        );

        formData.append(
            "description",
            description
        );

        for (let i = 0; i < files.length; i++) {

            formData.append(
                "images",
                files[i]
            );

        }

        let url =
            `${BASE_URL}/api/all-products/add`;

        let method = "POST";

        if (productId) {

            url =
                `${BASE_URL}/api/all-products/${productId}`;

            method = "PUT";

        }

        const res = await fetch(url, {
            method,
            body: formData
        });

        const result = await res.json();

        if (!res.ok) {

            return alert(
                result.message ||
                "Operation Failed"
            );

        }

        alert(
            productId
                ? "Product Updated Successfully"
                : "Product Added Successfully"
        );

        window.location.href = document.referrer || "all-products.html";

    } catch (error) {

        console.error(error);

        alert("Something Went Wrong");

    }

}


loadCategories().then(() => {
    loadProductForEdit();
});