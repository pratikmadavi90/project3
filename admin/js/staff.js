const API = "https://api.harzo.in/api/staff";

console.log("staff.js loaded");

const token = localStorage.getItem("adminToken");

const table = document.getElementById("staffTable");

async function loadStaff() {

    try {

        const res = await fetch(`${API}/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        table.innerHTML = "";

        if (!data.success || data.staff.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;">
                        No Staff Found
                    </td>
                </tr>
            `;

            return;
        }

        data.staff.forEach((item, index) => {

            table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${item.name}</td>

                <td>${item.staffId}</td>

                <td>${item.phone}</td>

                <td>
                    <span class="${item.status === "Active" ? "active" : "inactive"}">
                        ${item.status}
                    </span>
                </td>

                <td>
                    <span class="${item.online ? "online" : "offline"}">
                        ${item.online ? "Online" : "Offline"}
                    </span>
                </td>

                <td>${item.todayPacking || 0}</td>

                <td>

                    <button
                        class="editBtn"
                        onclick="editStaff('${item._id}')">

                        Edit

                    </button>

                    <button
                        class="deleteBtn"
                        onclick="deleteStaff('${item._id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    } catch (err) {

        console.log(err);

        alert("Failed to Load Staff");

    }

}


let editId = null;

async function addStaff() {

    console.log("Save clicked");

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("status").value;

    if (!name || !phone || !password) {
        return alert("Please fill all fields");
    }

    const payload = {
        name,
        phone,
        password,
        status
    };

    try {

        let url = `${API}/add`;
        let method = "POST";

        if (editId) {
            url = `${API}/${editId}`;
            method = "PUT";
        }

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        alert(data.message);

        if (data.success) {

            document.getElementById("name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("password").value = "";
            document.getElementById("status").value = "Active";

            editId = null;

            loadStaff();
        }

    } catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

}

document
    .getElementById("saveBtn")
    .addEventListener("click", addStaff);

async function editStaff(id) {

    try {

        const res = await fetch(`${API}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!data.success) {
            return alert(data.message);
        }

        const staff = data.staff;

        document.getElementById("name").value = staff.name;
        document.getElementById("phone").value = staff.phone;
        document.getElementById("password").value = "";
        document.getElementById("status").value = staff.status;

        editId = id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (err) {

        console.log(err);

        alert("Unable to load staff");

    }

}


async function deleteStaff(id) {

    if (!confirm("Delete this staff?")) return;

    try {

        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        alert(data.message);

        if (data.success) {
            loadStaff();
        }

    } catch (err) {

        console.log(err);

        alert("Delete Failed");

    }

}

document.getElementById("refreshBtn").addEventListener("click", () => {
    loadStaff();
});

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll("#staffTable tr").forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

});

loadStaff();