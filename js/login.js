document.addEventListener("DOMContentLoaded", function () {
    // =========================
    // LOGIN FORM (login.html)
    // =========================
    let loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let formData = new FormData(this);

            fetch("../php/login.php", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    let msg = document.getElementById("msg");
                    msg.innerText = data.message;

                    if (data.status === "success") {
                        msg.style.color = "green";

                        setTimeout(() => {
                            // =========================
                            // 🔥 NEW: ROLE REDIRECT
                            // =========================
                            if (data.role === "admin") {
                                window.location.href = "../html/Admin/admin.html";
                            } else {
                                window.location.href = "../index.html";
                            }
                        }, 1500);
                    } else {
                        msg.style.color = "red";
                    }
                })
                .catch((err) => console.log(err));
        });
    }

    // =========================
    // INDEX PAGE LOGIC (PHP SESSION VERSION)
    // =========================
    let loginLink = document.getElementById("loginLink");
    let helloText = document.getElementById("helloText");

    if (loginLink) {
        // جلب بيانات المستخدم من السيرفر
        fetch("php/get_user.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    helloText.innerText = "Hello " + data.first_name;
                    loginLink.innerText = "Logout";
                }
            });

        // =========================
        // LOGOUT HANDLER (MODIFIED)
        // =========================
        loginLink.addEventListener("click", function (e) {
            fetch("php/get_user.php")
                .then((res) => res.json())
                .then((data) => {
                    if (data.loggedIn) {
                        e.preventDefault();

                        // logout من السيرفر
                        fetch("php/logout.php").then(() => {
                            // مسح الواجهة
                            if (helloText) {
                                helloText.innerText = "";
                            }

                            loginLink.innerText = "Login";

                            // 🔥 Refresh نفس الصفحة فقط
                            location.reload();
                        });
                    }
                });
        });
    }
});
