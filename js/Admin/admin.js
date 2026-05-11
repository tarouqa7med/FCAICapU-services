// Admin Dashboard - Full CRUD + Activities

document.addEventListener("DOMContentLoaded", async () => {
    await loadDashboard();
    loadUsers();
    loadProjects();
    loadDonations();
    loadContacts();
    setupEvents();
});

function getEndpoint(entity) {
    switch (entity) {
        case 'user':
            return '../../php/Admin/update_users.php';
        case 'project':
            return '../../php/Admin/update_projects.php';
        case 'donation':
            return '../../php/Admin/update_donations.php';
        case 'contact':
            return '../../php/Admin/update_contacts.php';
        default:
            return null;
    }
}

function setupEvents() {
    document.getElementById("addUserBtn")?.addEventListener("click", addUser);
    document.getElementById("createProjectBtn")?.addEventListener("click", addProject);

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

async function loadDashboard() {
    try {
        const res = await fetch("../../php/Admin/update_users.php?stats=1");
        const stats = await res.json();
        document.getElementById("userCount").textContent = stats.users;
        document.getElementById("projectCount").textContent = stats.projects;
        document.getElementById("donationCount").textContent =
            "$" + Number(stats.donations || 0).toLocaleString();
        document.getElementById("contactCount").textContent = stats.contacts;
    } catch (err) {
        console.error("Stats load error:", err);
    }
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
            <tr data-id="${user.id}" data-entity="user">
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
                <td>${user.created_at || ""}</td>
                <td>
                    <button onclick="saveRow(${user.id}, 'user')" class="btn btn-sm btn-success">Save</button>
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
    const id = tr?.dataset.id;
    const entity = tr?.dataset.entity;
    const field = input.dataset.field;
    const value = input.tagName === "SELECT" || input.tagName === "TEXTAREA"
        ? input.value
        : input.value.trim();

    if (!field || !id || !entity) return;

    const endpoint = getEndpoint(entity);
    if (!endpoint) return;

    input.classList.add("is-saving");

    const payload = {
        action: "update",
        field,
        value,
    };

    if (entity === 'user') payload.user_id = id;
    if (entity === 'project') payload.project_id = id;
    if (entity === 'donation') payload.donation_id = id;
    if (entity === 'contact') payload.contact_id = id;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.success) {
            input.classList.add("saved");
            setTimeout(() => {
                input.classList.remove("saved");
                if (entity === 'user') loadUsers();
                if (entity === 'project') loadProjects();
                if (entity === 'donation') loadDonations();
                if (entity === 'contact') loadContacts();
            }, 500);
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

async function saveRow(id, entity) {
    const row = document.querySelector(`tr[data-id="${id}"][data-entity="${entity}"]`);
    if (!row) return;
    const inputs = row.querySelectorAll('[data-field]');
    for (const input of inputs) {
        await saveField(input);
    }
}

async function addUser() {
    const username = document.getElementById("newUsername")?.value.trim();
    const full_name = document.getElementById("newFullName")?.value.trim();
    const email = document.getElementById("newEmail")?.value.trim();
    const password = document.getElementById("newPassword")?.value || "temp123@";
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
            document.querySelectorAll("#newUsername, #newFullName, #newEmail, #newPassword").forEach((el) => el.value = "");
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

async function loadProjects() {
    const loading = document.getElementById("projectsLoading");
    const table = document.getElementById("projectsTable");

    if (!table) return console.error("Projects table not found");

    try {
        loading.style.display = "block";
        const res = await fetch("../../php/Admin/update_projects.php");
        const projects = await res.json();

        table.innerHTML = projects
            .map((project) => `
                <tr data-id="${project.id}" data-entity="project">
                    <td>${project.id}</td>
                    <td><input data-field="project_name" value="${project.project_name || ""}"></td>
                    <td>
                        <select data-field="category">
                            <option value="activities" ${project.category === "activities" ? "selected" : ""}>activities</option>
                            <option value="college" ${project.category === "college" ? "selected" : ""}>college</option>
                            <option value="graduationProjects" ${project.category === "graduationProjects" ? "selected" : ""}>graduationProjects</option>
                            <option value="students" ${project.category === "students" ? "selected" : ""}>students</option>
                        </select>
                    </td>
                    <td><input data-field="collected_money" value="${project.collected_money || 0}" type="number"></td>
                    <td><input data-field="pledged_goal" value="${project.pledged_goal || 0}" type="number"></td>
                    <td><input data-field="backers" value="${project.backers || 0}" type="number"></td>
                    <td><input data-field="days_to_go" value="${project.days_to_go || 0}" type="number"></td>
                    <td><input data-field="image" value="${project.image || ""}"></td>
                    <td><textarea data-field="description">${project.description || ""}</textarea></td>
                    <td>
                        <button onclick="saveRow(${project.id}, 'project')" class="btn btn-sm btn-success">Save</button>
                        <button onclick="deleteProject(${project.id})" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
            `)
            .join("");

        loading.style.display = "none";
    } catch (err) {
        console.error("Load projects error:", err);
        loading.textContent = "Error loading projects";
        loading.className = "alert alert-danger";
    }
}

async function addProject() {
    const projectName = document.getElementById("newProjectName")?.value.trim();
    const category = document.getElementById("newProjectCategory")?.value;
    const pledgedGoal = Number(document.getElementById("newProjectGoal")?.value || 0);
    const daysToGo = Number(document.getElementById("newProjectDays")?.value || 30);
    const image = document.getElementById("newProjectImage")?.value.trim();

    if (!projectName || pledgedGoal <= 0) {
        return alert("Project name and goal are required.");
    }

    try {
        const res = await fetch("../../php/Admin/update_projects.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create",
                project_name: projectName,
                category,
                pledged_goal: pledgedGoal,
                days_to_go: daysToGo,
                image,
                description: '',
            }),
        });
        const data = await res.json();

        if (data.success) {
            loadProjects();
            document.querySelectorAll("#newProjectName, #newProjectGoal, #newProjectDays, #newProjectImage").forEach((el) => el.value = "");
            alert("Project added.");
        } else {
            alert(data.message || "Failed to add project.");
        }
    } catch (err) {
        console.error(err);
        alert("Network error adding project.");
    }
}

async function deleteProject(id) {
    if (!confirm("Delete project and all related donations?")) return;

    try {
        const res = await fetch("../../php/Admin/update_projects.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", project_id: id }),
        });
        const data = await res.json();
        if (data.success) loadProjects();
        else alert(data.message || "Delete failed");
    } catch (err) {
        console.error(err);
        alert("Delete failed.");
    }
}

async function loadDonations() {
    const loading = document.getElementById("donationsLoading");
    const table = document.getElementById("donationsTable");

    if (!table) return console.error("Donations table not found");

    try {
        loading.style.display = "block";
        const res = await fetch("../../php/Admin/update_donations.php");
        const donations = await res.json();

        table.innerHTML = donations
            .map((donation) => `
                <tr data-id="${donation.id}" data-entity="donation">
                    <td>${donation.id}</td>
                    <td>${donation.user_name || donation.user_email || 'Unknown'}</td>
                    <td>${donation.project_name || donation.project_id}</td>
                    <td><input data-field="amount" value="${donation.amount || 0}" type="number"></td>
                    <td><input data-field="card_number" value="${donation.card_number || ''}"></td>
                    <td><input data-field="backer_name" value="${donation.backer_name || ''}"></td>
                    <td>${donation.created_at || ''}</td>
                    <td>
                        <button onclick="saveRow(${donation.id}, 'donation')" class="btn btn-sm btn-success">Save</button>
                        <button onclick="deleteDonation(${donation.id})" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
            `)
            .join("");

        loading.style.display = "none";
    } catch (err) {
        console.error("Load donations error:", err);
        loading.textContent = "Error loading donations";
        loading.className = "alert alert-danger";
    }
}

async function deleteDonation(id) {
    if (!confirm("Delete this donation?")) return;

    try {
        const res = await fetch("../../php/Admin/update_donations.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", donation_id: id }),
        });
        const data = await res.json();
        if (data.success) loadDonations();
        else alert(data.message || "Delete failed");
    } catch (err) {
        console.error(err);
        alert("Delete failed.");
    }
}

async function loadContacts() {
    const loading = document.getElementById("contactsLoading");
    const table = document.getElementById("contactsTable");

    if (!table) return console.error("Contacts table not found");

    try {
        loading.style.display = "block";
        const res = await fetch("../../php/Admin/update_contacts.php");
        const contacts = await res.json();

        table.innerHTML = contacts
            .map((contact) => `
                <tr data-id="${contact.id}" data-entity="contact">
                    <td>${contact.id}</td>
                    <td><input data-field="name" value="${contact.name || ''}"></td>
                    <td><input data-field="email" value="${contact.email || ''}" type="email"></td>
                    <td><textarea data-field="message">${contact.message || ''}</textarea></td>
                    <td>${contact.created_at || ''}</td>
                    <td>
                        <button onclick="saveRow(${contact.id}, 'contact')" class="btn btn-sm btn-success">Save</button>
                        <button onclick="deleteContact(${contact.id})" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
            `)
            .join("");

        loading.style.display = "none";
    } catch (err) {
        console.error("Load contacts error:", err);
        loading.textContent = "Error loading contacts";
        loading.className = "alert alert-danger";
    }
}

async function deleteContact(id) {
    if (!confirm("Delete this feedback entry?")) return;

    try {
        const res = await fetch("../../php/Admin/update_contacts.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", contact_id: id }),
        });
        const data = await res.json();
        if (data.success) loadContacts();
        else alert(data.message || "Delete failed");
    } catch (err) {
        console.error(err);
        alert("Delete failed.");
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
