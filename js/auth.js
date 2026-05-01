class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
    }

    checkAuth() {
        fetch("php/auth.php?check=1")
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    this.showLoggedIn(data.user);
                } else {
                    this.showLoggedOut();
                }
            })
            .catch(() => this.showLoggedOut());
    }

    showLoggedIn(user) {
        // الصورة
        const userLink = document.getElementById("userLink");
        const userImage = document.getElementById("userImage");
        if (userImage)
            userImage.src = user.image || "attachments/logos/default_user.jpg";
        if (userLink) {
            userLink.style.display = "block";
            userLink.href =
                user.role === "admin"
                    ? "html/Admin/admin.html"
                    : "html/User/user.html";
            userLink.title = `Hello, ${user.full_name || user.username}`;
        }

        // زر Sign Out
        const loginBtn = document.getElementById("loginLink");
        if (loginBtn) {
            loginBtn.textContent = "Sign Out";
            loginBtn.href = "#";
            loginBtn.className = "btn btn-danger mx-1 logoutBtn";
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
        }
    }

    showLoggedOut() {
        // الصورة مش active
        const userLink = document.getElementById("userLink");
        if (userLink) {
            userLink.style.display = "block";
            userLink.href = "javascript:void(0)";
            userLink.style.opacity = "0.5";
            userLink.style.pointerEvents = "none";
            userLink.title = "Please log in";
        }

        // زر Login
        const loginBtn = document.getElementById("loginLink");
        if (loginBtn) {
            loginBtn.textContent = "Login";
            loginBtn.href = "html/login.html";
            loginBtn.className = "btn btn-light mx-1 loginBtn";
            loginBtn.onclick = null;
        }
    }

    bindEvents() {
        // Login success callback
        window.handleLoginSuccess = () => {
            this.checkAuth();
        };
    }

    logout() {
        fetch("php/logout.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // تحديث فوري بدون reload
                    this.showLoggedOut();
                    // أو reload لو عايز
                    location.reload();
                }
            });
    }
}

new AuthManager();
