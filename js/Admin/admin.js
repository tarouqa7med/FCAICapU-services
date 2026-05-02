// Complete Admin JS - Full DB Users Table + CRUD
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addUserBtn').addEventListener('click', addUser);
    
    // Auto-save on change/blur for inputs/selects
    document.addEventListener('change', handleFieldChange);
    document.addEventListener('blur', handleFieldChange);
}

async function handleFieldChange(e) {
    const input = e.target.closest('td input, td select');
    if (!input) return;
    await saveUserField(input);
}

async function loadUsers() {
    const loading = document.getElementById('usersLoading');
    const tbody = document.getElementById('usersTable');
    
    try {
        loading.style.display = 'block';
        tbody.innerHTML = '';
        
        const res = await fetch('../../php/Admin/update_users.php');
        const users = await res.json();
        
        if (!Array.isArray(users)) throw new Error('Invalid response');
        
        document.getElementById('userCount').textContent = users.length;
        
        tbody.innerHTML = users.map(user => `
            <tr data-id="${user.id}">
                <td>${user.id}</td>
                <td data-field="username"><input class="form-control form-control-sm" value="${user.username || ''}"></td>
                <td data-field="full_name"><input class="form-control form-control-sm" value="${user.full_name || ''}"></td>
                <td data-field="email"><input class="form-control form-control-sm" value="${user.email || ''}" type="email"></td>
                <td data-field="role">
                    <select class="form-select form-select-sm">
                        <option ${user.role === 'user' ? 'selected' : ''}>user</option>
                        <option ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                    </select>
                </td>
                <td data-field="mobile"><input class="form-control form-control-sm" value="${user.mobile || ''}"></td>
                <td data-field="image"><input class="form-control form-control-sm" value="${user.image || ''}"></td>
                <td>
                    <button onclick="deleteUser(${user.id})" class="btn btn-sm btn-danger">🗑️ Delete</button>
                </td>
            </tr>
        `).join('');
        
        loading.style.display = 'none';
        
    } catch (err) {
        console.error('Load error:', err);
        loading.textContent = 'Error: Check console & admin login/DB';
        loading.style.color = 'red';
    }
}

async function saveUserField(input) {
    const tr = input.closest('tr');
    const id = tr.dataset.id;
    const td = input.closest('td');
    const field = td.dataset.field;
    let value = input.tagName === 'SELECT' ? input.value : input.value.trim();
    
    if (!field || !value) return;
    
    try {
        input.classList.add('saving');
        const res = await fetch('../../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'update', user_id: id, field, value})
        });
        
        const data = await res.json();
        if (data.success) {
            input.classList.add('saved');
            setTimeout(() => loadUsers(), 1000);
        } else {
            alert(data.message || 'Update failed');
        }
    } catch (err) {
        console.error('Save error:', err);
        alert('Save failed - check network');
    } finally {
        input.classList.remove('saving');
    }
}

async function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const fullName = document.getElementById('newFullName').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('newPassword').value || 'temp123@';
    const role = document.getElementById('newRole').value;
    
    if (!username || !fullName || !email) {
        alert('Username, Full Name & Email required');
        return;
    }
    
    try {
        document.getElementById('addUserBtn').textContent = 'Adding...';
        const res = await fetch('../../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'create', username, full_name: fullName, email, password, role})
        });
        
        const data = await res.json();
        if (data.success) {
            loadUsers();
            document.querySelector('.add-form').reset();
            alert(`✅ User "${username}" created!\nPassword: ${password}`);
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (err) {
        alert('❌ Add failed: ' + err.message);
    } finally {
        document.getElementById('addUserBtn').textContent = '➕ Add User';
    }
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    
    try {
        const res = await fetch('../../php/Admin/update_users.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'delete', user_id: id})
        });
        
        const data = await res.json();
        if (data.success) {
            loadUsers();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Delete failed');
    }
}

window.showSection = (section) => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section)?.classList.add('active');
};

// Admin full access indicator
document.addEventListener('DOMContentLoaded', () => {
    if (window.authManager?.user?.role === 'admin') {
        document.body.classList.add('admin-mode');
        console.log('✅ Super Admin Mode: Full Access Enabled');
    }
});


