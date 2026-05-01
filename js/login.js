document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const loading = submitBtn.querySelector(".loading");

    if (!form || !msg || !submitBtn) {
        console.error("Login elements not found!");
        return;
    }

    // 👇 منع multiple submits
    let isSubmitting = false;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 👇 منع الضغط مرة تانية
        if (isSubmitting) {
            console.log("⏳ Already submitting, ignoring...");
            return;
        }

        isSubmitting = true;

        // إخفاء الرسائل السابقة
        msg.textContent = "";
        msg.className = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // تحقق client-side
        if (!email) {
            showMessage("Please enter your email.", "error");
            isSubmitting = false;
            return;
        }
        if (!password) {
            showMessage("Please enter your password.", "error");
            isSubmitting = false;
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        setLoading(true);
        showMessage("Checking Data ⏳", "info");

        fetch("../php/login.php", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                showMessage(data.message, data.success ? "success" : "error");

                if (data.success) {
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1500);
                } else {
                    // 👇 إعادة تفعيل بعد خطأ
                    isSubmitting = false;
                    setLoading(false);
                }
            })
            .catch((error) => {
                showMessage("Connection Error: " + error.message, "error");
                console.error("Login Error:", error);
                // 👇 إعادة تفعيل بعد خطأ
                isSubmitting = false;
                setLoading(false);
            });
    });

    function showMessage(text, type) {
        msg.textContent = text;
        msg.className = `message ${type}`;
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? "none" : "inline";
        loading.style.display = isLoading ? "inline" : "none";
        submitBtn.style.opacity = isLoading ? "0.25" : "1";
        submitBtn.style.cursor = isLoading ? "not-allowed" : "pointer";
    }
});
