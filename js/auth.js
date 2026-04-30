window.addEventListener("load", function () {
    // =========================
    // 🔹 COMMON (لكل الصفحات)
    // =========================
    function handleNavbar() {
        let loginLink = document.getElementById("loginLink");
        let userLink = document.getElementById("userLink");
        let userImage = document.getElementById("userImage");
        let helloText = document.getElementById("helloText");

        if (!loginLink) return;

        fetch(getBasePath() + "php/get_user.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    loginLink.innerText = "Logout";
                    loginLink.removeAttribute("href");

                    if (helloText) {
                        helloText.innerText = "Hello " + data.first_name;
                    }

                    userLink.href = getBasePath() + "html/User/user.html";
                } else {
                    loginLink.innerText = "Login";
                    loginLink.setAttribute(
                        "href",
                        getBasePath() + "html/login.html",
                    );

                    if (helloText) {
                        helloText.innerText = "";
                    }

                    userLink.href = getBasePath() + "html/login.html";
                }
            });

        // logout
        loginLink.addEventListener("click", function (e) {
            fetch(getBasePath() + "php/get_user.php")
                .then((res) => res.json())
                .then((data) => {
                    if (data.loggedIn) {
                        e.preventDefault();

                        fetch(getBasePath() + "php/logout.php").then(() => {
                            window.location.href = getBasePath() + "index.html";
                        });
                    }
                });
        });
    }

    // =========================
    // 🔹 INDEX
    // =========================
    function initIndex() {
        console.log("Index Page Loaded");
        handleNavbar();
    }

    // =========================
    // 🔹 SUPPORT PAGES
    // =========================
    function initSupportPages() {
        console.log("Support Pages Loaded");
        handleNavbar();

        // أي كود خاص بالـ support
    }

    // =========================
    // 🔹 ADMIN + USER
    // =========================
    function initDashboard() {
        console.log("Admin/User Page Loaded");
        handleNavbar();

        // ممكن تضيف check role هنا
    }

    // =========================
    // 🔥 تحديد الصفحة تلقائي
    // =========================
    let page = document.body.getAttribute("data-page");

    switch (page) {
        case "index":
            initIndex();
            break;

        case "support":
            initSupportPages();
            break;

        case "dashboard":
            initDashboard();
            break;

        default:
            handleNavbar();
    }
});

// =========================
// 🔥 حل مشكلة المسارات مرة واحدة
// =========================
function getBasePath() {
    let path = window.location.pathname;

    if (path.includes("/html/")) {
        return "../";
    }

    return "";
}
