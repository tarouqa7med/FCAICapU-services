document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const loading = submitBtn.querySelector(".loading");

    if (!form || !msg || !submitBtn) {
        console.error("Register elements not found!");
        return;
    }

    let isSubmitting = false;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (isSubmitting) {
            console.log("Already submitting...");
            return;
        }

        isSubmitting = true;

        msg.textContent = "";
        msg.className = "";

        const username = document.getElementById("username")?.value.trim();
        const full_name = document.getElementById("full_name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!username || !full_name || !email || !password) {
            showMessage("Please fill all fields", "error");
            isSubmitting = false;
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("full_name", full_name);
        formData.append("email", email);
        formData.append("password", password);

        setLoading(true);
        showMessage("Creating account ⏳", "info");

        fetch("../php/register.php", {
            method: "POST",
            body: formData,
            credentials: 'same-origin'
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            showMessage(data.message, data.success ? "success" : "error");
            if (data.success) {
                // Sync auth
                if (window.authManager?.channel) {
                    window.authManager.channel.postMessage({type: 'login', user: {role: 'user'}});
                }
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 2000);
            } else {
                isSubmitting = false;
                setLoading(false);
            }
        })
        .catch(error => {
            showMessage("Connection error: " + error.message, "error");
            console.error("Register error:", error);
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
        if (btnText) btnText.style.display = isLoading ? "none" : "inline";
        if (loading) loading.style.display = isLoading ? "inline" : "none";
        submitBtn.style.opacity = isLoading ? "0.6" : "1";
    }
});

