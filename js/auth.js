window.addEventListener("load", function () {
    let loginLink = document.getElementById("loginLink");
    let userLink = document.getElementById("userLink");
    let userImage = document.getElementById("userImage");
    let helloText = document.getElementById("helloText");

    if (!loginLink) return;

    let originalHref = loginLink.getAttribute("href");

    // =========================
    // 1) LOAD FROM LOCALSTORAGE (سريع)
    // =========================
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("name");

    if (isLoggedIn === "true") {
        loginLink.innerText = "Logout";
        loginLink.removeAttribute("href");

        if (helloText) {
            helloText.innerText = "Hello " + name;
        }
    }

    // =========================
    // 2) VERIFY FROM SERVER (SESSION)
    // =========================
    fetch("php/get_user.php")
        .then((res) => res.json())
        .then((data) => {
            if (data.loggedIn) {
                // ✅ sync مع localStorage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("name", data.first_name);
                localStorage.setItem("role", data.role);

                loginLink.innerText = "Logout";
                loginLink.removeAttribute("href");

                if (helloText) {
                    helloText.innerText = "Hello " + data.first_name;
                }

                if (data.image) {
                    userImage.src = data.image;
                }

                userLink.href = "html/User/user.html";
            } else {
                // ❌ session انتهت
                localStorage.clear();

                loginLink.innerText = "Login";
                loginLink.setAttribute("href", originalHref);

                if (helloText) {
                    helloText.innerText = "";
                }

                userImage.src = "attachments/logos/default_user.jpg";
                userLink.href = "html/login.html";
            }
        });

    // =========================
    // LOGOUT
    // =========================
    loginLink.addEventListener("click", function (e) {
        let isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn === "true") {
            e.preventDefault();

            fetch("php/logout.php").then(() => {
                // مسح كل حاجة
                localStorage.clear();

                loginLink.innerText = "Login";
                loginLink.setAttribute("href", "html/login.html");

                if (helloText) {
                    helloText.innerText = "";
                }

                userImage.src = "attachments/logos/default_user.jpg";
                userLink.href = "html/login.html";

                // رجوع للـ index
                window.location.href = "/index.html";
            });
        }
    });
});
