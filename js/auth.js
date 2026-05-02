// FIXED AuthManager - Sync Perfect with PHP - Admin/Admin Pages Work
class AuthManager {
    constructor() {
        this.loggedIn = false;
        this.channel = new BroadcastChannel('auth-channel');
        this.init();
    }

    init() {
        console.log('🚀 AuthManager -', window.location.pathname);
        this.checkAuth();
        this.listenBroadcast();
        window.handleLoginSuccess = () => this.checkAuth();
    }

async checkAuth() {
        const url = this.getApiUrl();
        try {
            const res = await fetch(`${url}?check=1`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            console.log('🚀 Auth check:', data);

            this.loggedIn = data.loggedIn;
            if (data.loggedIn && data.user) {
                this.showUser(data.user);
                this.channel.postMessage({type: 'login', user: data.user});
            } else {
                this.showGuest();
                this.channel.postMessage({type: 'logout'});
            }
        } catch (err) {
            console.error('❌ Auth fail:', err);
            this.loggedIn = false;
            this.showGuest();
        }
    }

    getApiUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const depth = pathSegments.length;
        const phpPath = '../'.repeat(depth) + 'php/auth.php';
        console.log('📍 API path:', phpPath, 'depth:', depth);
        return phpPath;
    }

    getLogoutUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const depth = pathSegments.length;
        return '../'.repeat(depth) + 'php/logout.php';
    }

    listenBroadcast() {
        this.channel.onmessage = (e) => {
            if (e.data.type === 'login') this.showUser(e.data.user);
            if (e.data.type === 'logout') this.showGuest();
        };
    }

    showUser(user) {
        const link = document.getElementById('userLink');
        const img = document.getElementById('userImage');
        const btn = document.getElementById('loginLink');

        if (img) {
            img.src = user.image || 'attachments/logos/default_user.jpg';
            img.onerror = () => { img.src = 'attachments/logos/default_user.jpg'; };
            img.alt = user.username || 'User';
        }

        if (link) {
            link.style.display = 'block';
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
            link.title = `Profile: ${user.username || user.full_name}`;
        }

        if (btn) {
            const isAdmin = user.role === 'admin';
            btn.textContent = isAdmin ? '👑 Admin' : 'Logout';
            btn.className = isAdmin ? 'btn btn-warning logoutBtn' : 'btn btn-danger logoutBtn';
            btn.href = '#';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.logout();
            };
        }
    }

    showGuest() {
        const link = document.getElementById('userLink');
        const btn = document.getElementById('loginLink');

        if (link) {
            link.style.display = 'block';
            link.style.opacity = '0.5';
            link.style.pointerEvents = 'none';
        }

        if (btn) {
            btn.textContent = 'Login';
            btn.className = 'btn btn-light loginBtn';
            btn.href = this.getLoginUrl();
            btn.onclick = null;
        }
    }

    // getImagePath removed - use PHP relative path directly

    getProfileUrl(role) {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const depth = pathSegments.length;
        const base = '../'.repeat(Math.max(0, depth - 1));
        return base + (role === 'admin' ? 'html/Admin/admin.html' : 'html/User/user.html');
    }

    getLoginUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const depth = pathSegments.length;
        return '../'.repeat(Math.max(0, depth - 1)) + 'html/login.html';
    }

    async logout() {
        try {
            await fetch(this.getLogoutUrl(), { 
                method: 'POST',
                credentials: 'same-origin'
            });
            this.channel.postMessage({type: 'logout'});
            // Smart redirect to root index.html
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const depth = pathSegments.length;
            const rootPath = '../'.repeat(depth) + 'index.html';
            window.location.href = rootPath;
        } catch (err) {
            console.error('Logout error:', err);
            location.reload();
        }
    }
}

console.log('AuthManager loaded');
window.authManager = new AuthManager();

