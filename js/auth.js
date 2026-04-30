window.addEventListener("load", function () {
    let loginLink = document.getElementById("loginLink");
    let userLink = document.getElementById("userLink");
    let userImage = document.getElementById("userImage");

    let originalHref = loginLink.getAttribute("href");

    // =========================
    // CHECK LOGIN FROM SERVER
    // =========================
    fetch("php/get_user.php")
        .then((res) => res.json())
        .then((data) => {
            if (data.loggedIn) {
                loginLink.innerText = "Logout";

                // ❗ مهم: نشيل الـ href وقت logout
                loginLink.removeAttribute("href");

                if (data.image) {
                    userImage.src = data.image;
                }

                userLink.href = "html/User/user.html";
            } else {
                loginLink.innerText = "Login";

                // نرجّع href بتاع login
                loginLink.setAttribute("href", originalHref);

                userImage.src = "attachments/logos/default_user.jpg";

                userLink.href = "html/login.html";
            }
        });

    // =========================
    // LOGOUT
    // =========================
    loginLink.addEventListener("click", function (e) {
        fetch("php/get_user.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    e.preventDefault();

                    fetch("php/logout.php").then(() => {
                        loginLink.innerText = "Login";

                        userImage.src = "attachments/logos/default_user.jpg";

                        // ❗ رجّع الـ href بعد logout
                        loginLink.setAttribute("href", "html/login.html");

                        location.reload();
                    });
                }
            });
    });
});
