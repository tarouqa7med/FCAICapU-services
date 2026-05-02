// User Support JS
document.addEventListener('DOMContentLoaded', () => {
    loadSupportTickets();
    
    document.getElementById('supportForm')?.addEventListener('submit', submitTicket);
});

async function loadSupportTickets() {
    const res = await fetch('../php/Support/userSupport.php');
    const tickets = await res.json();
    const container = document.getElementById('supportTickets');
    container.innerHTML = tickets.map(t => `
        <div class="ticket">
            <h6>${t.name}</h6>
            <p>${t.message}</p>
            <small>${t.created_at}</small>
        </div>
    `).join('');
}

async function submitTicket(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('action', 'submit');
    
    const res = await fetch('../php/Support/userSupport.php', {method: 'POST', body: formData});
    const data = await res.json();
    
    if (data.success) {
        loadSupportTickets();
        e.target.reset();
    } else {
        alert(data.message);
    }
}

