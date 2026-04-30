
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateCounts() {
  document.getElementById('userCount').innerText = document.querySelectorAll('#usersTable tr').length;
  document.getElementById('productCount').innerText = document.querySelectorAll('#productsTable tr').length;
  document.getElementById('orderCount').innerText = document.querySelectorAll('#ordersTable tr').length;
}

function loadUsers() {
    fetch("../../php/get_users.php")
        .then((res) => res.json())
        .then((data) => {
            let table = document.getElementById("usersTable");
            table.innerHTML = "";

            data.forEach((user) => {
                table.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                        <button onclick='editUser(${user.id}, "${user.name}", "${user.email}")'>Edit</button>
                    </td>
                </tr>`;
            });

            updateCounts();
        });
}

// أول ما الصفحة تفتح
function addUser() {
    let name = document.getElementById("userName").value;
    let email = document.getElementById("userEmail").value;

    fetch("../../php/add_user.php", {
        method: "POST",
        body: new URLSearchParams({
            name: name,
            email: email,
        }),
    })
        .then((res) => res.json())
        .then(() => {
            loadUsers(); // refresh
        });

    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
}

function deleteUser(id) {
    fetch("../../php/delete_user.php", {
        method: "POST",
        body: new URLSearchParams({ id: id }),
    })
        .then((res) => res.json())
        .then(() => {
            loadUsers();
        });
}

let currentUserId = null;

function editUser(id, name, email) {
    currentUserId = id;

    document.getElementById("userName").value = name;
    document.getElementById("userEmail").value = email;
}

function updateUser() {
    let name = document.getElementById("userName").value;
    let email = document.getElementById("userEmail").value;

    fetch("../../php/update_user.php", {
        method: "POST",
        body: new URLSearchParams({
            id: currentUserId,
            name: name,
            email: email,
        }),
    })
        .then((res) => res.json())
        .then(() => {
            loadUsers();
        });

    currentUserId = null;

    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
}

window.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});























// ----- Log out -----------------------------------

// Open Modal
const signoutBtn = document.querySelector(".signoutBtn");

if (signoutBtn) {
    signoutBtn.addEventListener("click", () => {
        document.getElementById("logoutModal").style.display = "flex";
    });
}

// Cancel
document.getElementById("cancelLogout").addEventListener("click", () => {
    document.getElementById("logoutModal").style.display = "none";
});

// Confirm Logout
document.getElementById("confirmLogout").addEventListener("click", () => {

    // هنا هنعمل ربط بـ PHP
    fetch("../../php/logout.php")
        .then(() => {
            window.location.href = "../../index.html";
        });

});