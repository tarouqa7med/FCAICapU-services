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

                        // ✅ تخزين البيانات (مهم للـ navbar)
                        localStorage.setItem("isLoggedIn", "true");
                        localStorage.setItem("name", data.user.name);
                        localStorage.setItem("role", data.user.role);

                        setTimeout(() => {
                            // ✅ استخدام redirect من الـ PHP مباشرة
                            window.location.href = data.redirect;
                        }, 1000);
                    } else {
                        msg.style.color = "red";
                    }
                })
                .catch((err) => console.log(err));
        });
    }

    // =========================
    // NAVBAR LOGIC (كل الصفحات)
    // =========================
    let loginLink = document.getElementById("loginLink");
    let helloText = document.getElementById("helloText");

    if (loginLink) {
        let isLoggedIn = localStorage.getItem("isLoggedIn");
        let name = localStorage.getItem("name");

        // =========================
        // عرض الحالة من localStorage
        // =========================
        if (isLoggedIn === "true") {
            if (helloText) {
                helloText.innerText = "Hello " + name;
            }
            loginLink.innerText = "Logout";
        }

        // =========================
        // تأكيد من السيرفر (Session)
        // =========================
        fetch("php/get_user.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    // تحديث localStorage لو مش موجود
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("name", data.first_name);
                    localStorage.setItem("role", data.role);

                    if (helloText) {
                        helloText.innerText = "Hello " + data.first_name;
                    }

                    loginLink.innerText = "Logout";
                } else {
                    // لو السيشن انتهت
                    localStorage.clear();

                    if (helloText) {
                        helloText.innerText = "";
                    }

                    loginLink.innerText = "Login";
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

                    if (helloText) {
                        helloText.innerText = "";
                    }

                    loginLink.innerText = "Login";

                    // رجوع للـ index
                    window.location.href = "/index.html";
                });
            }
        });
    }
});
