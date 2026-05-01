// إرسال نموذج الاتصال بـ AJAX
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const msgDiv = document.getElementById('msg');
    
    fetch('php/contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            msgDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
            document.querySelector('form').reset();
            // إخفاء الرسالة بعد 5 ثواني
            setTimeout(() => {
                msgDiv.innerHTML = '';
            }, 5000);
        } else {
            msgDiv.innerHTML = `<div class="alert alert-danger">Please sign in, First.</div>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        msgDiv.innerHTML = `<div class="alert alert-danger">Please sure you are connected to the internet.</div>`;
    });
});

// تحديث حالة المستخدم عند تحميل الصفحة
fetch('../php/contact.php')
.then(response => response.json())
.then(data => {
    if (data.loggedIn) {
        const userImage = document.getElementById('userImage');
        const loginLink = document.getElementById('loginLink');
        
        if (userImage) userImage.src = data.userImage;
        if (loginLink) loginLink.style.display = 'none';
        
        // إضافة زر Logout
        const logoutContainer = loginLink.parentNode;
        let logoutBtn = logoutContainer.querySelector('.logout-btn');
        if (!logoutBtn) {
            logoutBtn = document.createElement('a');
            logoutBtn.href = '../php/logout.php';
            logoutBtn.className = 'btn btn-danger mx-1 logout-btn';
            logoutBtn.textContent = 'Logout';
            logoutContainer.appendChild(logoutBtn);
        }
    }
});