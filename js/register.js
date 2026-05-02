document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('msg');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        msg.textContent = 'Creating account...';
        msg.className = 'message info';

        fetch('../php/register.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                msg.innerHTML = `<div class="message success">${data.message}</div>`;
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                msg.innerHTML = `<div class="message error">${data.message}</div>`;
            }
        })
        .catch(err => {
            msg.innerHTML = `<div class="message error">Network error</div>`;
            console.error(err);
        });
    });
});

