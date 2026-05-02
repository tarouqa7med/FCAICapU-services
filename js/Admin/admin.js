// Enhanced Admin JS - Full CRUD for users w/ auto DB update
let editingUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addUserBtn')?.addEventListener('click', addUser);
    // Auto-save inputs
    const inputs = document.querySelectorAll('#users input');
    inputs.forEach(input => input.addEventListener('blur', saveUserField));
}

async function loadUsers() {
    try {
        const res = await fetch('../php/Admin/update_users.php');
        const users = await res.json();
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr data-id="${user.id}">
                <td><input value="${user.username}" onchange="saveUserField(this)"></td>
                <td><input value="${user.email}" onchange="saveUserField(this)"></td>
                <td><input value="${user.role}" onchange="saveUserField(this)"></td>
                <td><button onclick="deleteUser(${user.id})" class="btn btn-sm btn-danger">Delete</button></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Load users error:', err);
    }
}

async function saveUserField(input) {
    const tr = input.closest('tr');
    const id = tr.dataset.id;
    const field = input.parentElement.dataset.field || input.parentElement.textContent.toLowerCase().trim();
    const value = input.value;
    
    try {
        const res = await fetch('../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'update', user_id: id, field, value})
        });
        const data = await res.json();
        if (!data.success) alert(data.message);
        loadUsers(); // Reload
    } catch (err) {
        alert('Update failed');
    }
}

async function addUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    if (!name || !email) return alert('Name & email required');
    
    try {
        const res = await fetch('../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'create', full_name: name, email})
        });
        const data = await res.json();
        if (data.success) {
            loadUsers();
            document.getElementById('userName').value = '';
            document.getElementById('userEmail').value = '';
            alert('User added! Password: temp123@');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Add failed: ' + err.message);
    }
}

async function deleteUser(id) {
    if (!confirm('Delete user?')) return;
    try {
        const res = await fetch('../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'delete', user_id: id})
        });
        loadUsers();
    } catch (err) {
        alert('Delete failed');
    }
}

window.showSection = (section) => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
};


