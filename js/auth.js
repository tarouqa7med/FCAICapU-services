class AuthManager {
    constructor() {
        this.channel = new BroadcastChannel("auth-channel");
        this.init();
    }

    init() {
        console.log(
            "🚀 AuthManager starting - Path:",
            window.location.pathname,
        );
        this.checkAuth();
        this.bindEvents();
        this.listenForBroadcast();
    }

    checkAuth() {
        const phpUrl = this.getPhpUrl();
        console.log("🔍 Using PHP URL:", phpUrl);

        fetch(phpUrl + "?check=1")
            .then((res) => {
                console.log("📡 Auth response status:", res.status);
                return res.json();
            })
            .then((data) => {
                console.log("✅ Auth data received:", data);
                if (data.loggedIn && data.user) {
                    this.showLoggedIn(data.user);
                    this.broadcastStatus("login", data.user);
                } else {
                    this.showLoggedOut();
                    this.broadcastStatus("logout");
                }
            })
            .catch((err) => {
                console.error("❌ Auth check failed:", err, "URL:", phpUrl);
                this.showLoggedOut();
            });
    }

    // 👇 PERFECT path detection
    getPhpUrl() {
        const path = window.location.pathname.toLowerCase().trim();

        console.log("📍 Full path analysis:", path);

        // Root pages (index.html, /)
        if (
            path === "/" ||
            path === "/index.html" ||
            path.endsWith("index.html")
        ) {
            return "./php/auth.php"; // 👈 ROOT FIXED
        }

        // HTML subfolder
        if (path.includes("/html/")) {
            return "../php/auth.php";
        }

        // Default fallback
        return "./php/auth.php";
    }

getLogoutUrl() {
        const path = window.location.pathname.toLowerCase().trim();

        console.log("📍 Logout URL path analysis:", path);

        // Root pages (index.html, /)
        if (
            path === "/" ||
            path === "/index.html" ||
            path.endsWith("index.html")
        ) {
            return "./php/logout.php";
        }

        // Nested HTML subfolders like html/User/user.html or html/Admin/admin.html
        if (path.includes("/html/user/") || path.includes("/html/admin/") || path.includes("/html/support/")) {
            return "../../php/logout.php";
        }

        // Single level HTML subfolder like html/login.html
        if (path.includes("/html/")) {
            return "../php/logout.php";
        }

        return "./php/logout.php";
    }

    listenForBroadcast() {
        this.channel.addEventListener("message", (event) => {
            console.log("📡 Broadcast received:", event.data);
            if (event.data.type === "login") {
                this.showLoggedIn(event.data.user);
            } else if (event.data.type === "logout") {
                this.showLoggedOut();
            }
        });
    }

    broadcastStatus(type, user = null) {
        console.log("📢 Broadcasting:", type);
        this.channel.postMessage({
            type: type,
            user: user,
            timestamp: Date.now(),
            fromPath: window.location.pathname,
        });
    }

    getImagePath() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("/html/")) {
            return "../attachments/logos/default_user.jpg";
        }
        return "./attachments/logos/default_user.jpg";
    }

    getProfileUrl(role) {
        const base = window.location.pathname.includes("/html/") ? "" : "html/";
        return `${base}${role === "admin" ? "Admin/admin.html" : "User/user.html"}`;
    }

    getLoginUrl() {
        return window.location.pathname.includes("/html/")
            ? "login.html"
            : "html/login.html";
    }

    showLoggedIn(user) {
        console.log("👤 Showing logged in state for:", user.username);

        const userLink = document.getElementById("userLink");
        const userImage = document.getElementById("userImage");
        const loginBtn = document.getElementById("loginLink");

        if (userImage) {
            const imgPath = this.getImagePath();
            console.log("🖼️ Setting image:", user.image || imgPath);
            userImage.src = user.image || imgPath;
            userImage.onerror = () => {
                console.log("🖼️ Image fallback");
                userImage.src = this.getImagePath();
            };
        }

        if (userLink) {
            userLink.style.display = "block";
            userLink.style.opacity = "1";
            userLink.style.pointerEvents = "auto";
            userLink.href = this.getProfileUrl(user.role || "user");
            console.log("🔗 Profile link:", userLink.href);
        }

        if (loginBtn) {
            loginBtn.textContent = "Sign Out";
            loginBtn.href = "#";
            loginBtn.className = "btn btn-danger mx-1 logoutBtn";
            loginBtn.onclick = (e) => {
                e.preventDefault();
                console.log("🚪 Sign Out clicked");
                this.logout();
            };
            console.log("✅ Sign Out button activated");
        }
    }

    showLoggedOut() {
        console.log("🚪 Showing logged out state");

        const userLink = document.getElementById("userLink");
        const loginBtn = document.getElementById("loginLink");

        if (userLink) {
            userLink.style.display = "block";
            userLink.href = "javascript:void(0)";
            userLink.style.opacity = "0.5";
            userLink.style.pointerEvents = "none";
        }

        if (loginBtn) {
            loginBtn.textContent = "Login";
            loginBtn.href = this.getLoginUrl();
            loginBtn.className = "btn btn-light mx-1 loginBtn";
            loginBtn.onclick = null;
            console.log("✅ Login button restored");
        }
    }

    bindEvents() {
        window.handleLoginSuccess = () => {
            console.log("🎉 Login success callback");
            this.checkAuth();
        };
    }

    logout() {
        console.log("🚪 Starting logout - URL:", this.getLogoutUrl());

        fetch(this.getLogoutUrl(), {
            method: "POST",
            credentials: "same-origin",
        })
            .then((res) => {
                console.log("📡 Logout response:", res.status);
                return res.json();
            })
            .then((data) => {
                console.log("✅ Logout complete:", data);
                this.broadcastStatus("logout");

                // Smart redirect
                const path = window.location.pathname.toLowerCase();
                if (path === "/" || path.includes("index")) {
                    location.reload();
                } else if (path.includes("/html/")) {
                    window.location.href = "../index.html";
                } else {
                    window.location.href = "./index.html";
                }
            })
            .catch((err) => {
                console.error("💥 Logout error:", err);
                this.broadcastStatus("logout");
                location.reload();
            });
    }
}

window.authManager = new AuthManager();
