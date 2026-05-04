// Admin Dashboard - Full CRUD + Activities

document.addEventListener("DOMContentLoaded", async () => {
    await loadDashboard();
    loadUsers();
    setupEvents();
});

async function loadDashboard() {
    try {
        const res = await fetch("../../php/Admin/update_users.php?stats=1");
        const stats = await res.json();
        document.getElementById("userCount").textContent = stats.users;
        document.getElementById("projectCount").textContent = stats.projects;
        document.getElementById("donationCount").textContent =
            "$" + stats.donations.toLocaleString();
        document.getElementById("contactCount").textContent = stats.contacts;
    } catch (err) {
        console.error("Stats load error:", err);
    }
}

function setupEvents() {
    document.getElementById("addUserBtn")?.addEventListener("click", addUser);
    document.addEventListener(
        "change",
        (e) => {
            const input = e.target.closest("[data-field]");
            if (input) saveField(input);
        },
        true,
    );

    document.addEventListener(
        "blur",
        (e) => {
            const input = e.target.closest("[data-field]");
            if (input) saveField(input);
        },
        true,
    );
}

async function loadUsers() {
    const loading = document.getElementById("usersLoading");
    const table = document.getElementById("usersTable");

    if (!table) return console.error("Users table not found");

    try {
        loading.style.display = "block";
        const res = await fetch("../../php/Admin/update_users.php");
        const users = await res.json();

        document.getElementById("userCount").textContent = users.length;
        table.innerHTML = users
            .map(
                (user) => `
            <tr data-id="${user.id}">
                <td>${user.id}</td>
                <td><input data-field="username" value="${user.username || ""}"></td>
                <td><input data-field="full_name" value="${user.full_name || ""}"></td>
                <td><input data-field="email" value="${user.email || ""}" type="email"></td>
                <td>
                    <select data-field="role">
                        <option ${user.role === "user" ? "selected" : ""}>user</option>
                        <option ${user.role === "admin" ? "selected" : ""}>admin</option>
                    </select>
                </td>
                <td><input data-field="mobile" value="${user.mobile || ""}"></td>
                <td><input data-field="image" value="${user.image || ""}"></td>
                <td>
                    <button onclick="deleteUser(${user.id})" class="btn btn-sm btn-danger">Delete</button>
                    <button onclick="viewActivities(${user.id})" class="btn btn-sm btn-info">Activities</button>
                </td>
            </tr>
        `,
            )
            .join("");

        loading.style.display = "none";
    } catch (err) {
        console.error("Load users error:", err);
        loading.textContent = "Error loading users";
        loading.className = "alert alert-danger";
    }
}

async function saveField(input) {
    const tr = input.closest("tr");
    const id = tr.dataset.id;
    const field = input.dataset.field;
    const value = input.tagName === "SELECT" ? input.value : input.value.trim();

    if (!field || !id) return;

    input.classList.add("is-saving");

    try {
        const res = await fetch("../../php/Admin/update_users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update",
                user_id: id,
                field,
                value,
            }),
        });

        const data = await res.json();
        if (data.success) {
            input.classList.add("saved");
            setTimeout(() => loadUsers(), 500);
        } else {
            alert(data.message || "Update failed");
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("Save failed");
    } finally {
        input.classList.remove("is-saving");
    }
}

async function addUser() {
    const username = document.getElementById("newUsername")?.value.trim();
    const full_name = document.getElementById("newFullName")?.value.trim();
    const email = document.getElementById("newEmail")?.value.trim();
    const password =
        document.getElementById("newPassword")?.value || "temp123@";
    const role = document.getElementById("newRole")?.value || "user";

    if (!username || !full_name || !email) return alert("Fill required fields");

    try {
        const res = await fetch("../../php/Admin/update_users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create",
                username,
                full_name,
                email,
                password,
                role,
            }),
        });

        const data = await res.json();
        if (data.success) {
            loadUsers();
            // Clear form
            document
                .querySelectorAll("#newUsername, #newFullName, #newEmail")
                .forEach((el) => (el.value = ""));
            alert("User added");
        } else {
            alert(data.message || "Add failed");
        }
    } catch (err) {
        alert("Network error");
    }
}

async function deleteUser(id) {
    if (!confirm("Delete user?")) return;

    try {
        const res = await fetch("../../php/Admin/update_users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", user_id: id }),
        });

        const data = await res.json();
        if (data.success) loadUsers();
        else alert(data.message);
    } catch (err) {
        alert("Delete failed");
    }
}

async function viewActivities(id) {
    try {
        const res = await fetch("../../php/Admin/update_users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "user_activities", user_id: id }),
        });

        const activities = await res.json();
        alert(
            `User ${id} activities:\n` +
                activities
                    .map(
                        (a) =>
                            `$${a.amount} - ${a.project || "N/A"} (${a.created_at})`,
                    )
                    .join("\n"),
        );
    } catch (err) {
        alert("No activities");
    }
}

window.showSection = (section) => {
    document
        .querySelectorAll(".section")
        .forEach((s) => s.classList.remove("active"));
    document.getElementById(section)?.classList.add("active");
};
