
function initResetPasswordPage() {
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const newPasswordInput = document.getElementById("newPassword");
    const otpSubmitBtn = document.getElementById("otpSubmitBtn");
    const resetSubmitBtn = document.getElementById("resetSubmitBtn");

    if (emailInput) emailInput.disabled = false;
    if (otpInput) otpInput.disabled = true;
    if (newPasswordInput) newPasswordInput.disabled = true;
    if (otpSubmitBtn) otpSubmitBtn.disabled = true;
    if (resetSubmitBtn) resetSubmitBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', initResetPasswordPage);

function checkEmail() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const status = document.getElementById("emailStatus");
    const otpInput = document.getElementById("otp");
    const otpSubmitBtn = document.getElementById("otpSubmitBtn");
    const resetSubmitBtn = document.getElementById("resetSubmitBtn");
    const newPasswordInput = document.getElementById("newPassword");
    const emailSubmitBtn = document.getElementById("emailSubmitBtn");

    // reset fields for new attempt
    otpInput.value = "";
    newPasswordInput.value = "";
    otpInput.disabled = true;
    otpSubmitBtn.disabled = true;
    newPasswordInput.disabled = true;
    resetSubmitBtn.disabled = true;

    // 1) empty
    if (email === "") {
        status.innerText = "Enter a valid email";
        status.style.color = "red";
        return;
    }

    // 2) email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        status.innerText = "Enter correct email";
        status.style.color = "red";
        return;
    }

    // 3) valid format → now call PHP (AJAX)
    fetch("../php/send_otp.php", {
        method: "POST",
        credentials: "same-origin",
        body: new URLSearchParams({ email: email }),
    })
        .then((res) => res.text())
        .then((data) => {
            if (data.startsWith("valid")) {
                const parts = data.split("|");
                const otpCode = parts[1]; // actual OTP from PHP

                status.innerHTML = `
                                <span style="color:green;">
                                    Correct email. 
                                    <span style="color:black;">Your OTP:</span> 
                                    <b style="color:blue;" id="otpCodeText">${otpCode}</b>
                                </span>
                                <button style="margin-left:15px;" type="button" onclick="copyOTP()">Copy</button>
                            `;

                emailInput.disabled = true;
                if (emailSubmitBtn) emailSubmitBtn.disabled = true;
                otpInput.disabled = false;
                if (otpSubmitBtn) otpSubmitBtn.disabled = false;
                otpInput.focus();
            } else if (data === 'invalid_email') {
                status.innerText = "Email not found";
                status.style.color = "red";
            } else {
                status.innerText = "Server error";
                status.style.color = "red";
            }
        })
        .catch(() => {
            status.innerText = "Server error";
            status.style.color = "red";
        });
}

function copyOTP() {
    const otpText = document.getElementById("otpCodeText").innerText;
    const status = document.getElementById("emailStatus");

    navigator.clipboard.writeText(otpText).then(() => {
        status.innerHTML = ` <span style="color:green; margin-left:10px;">Copied ✔</span>`;
    });
}
function verifyOTP() {
    const otp = document.getElementById("otp").value.trim();
    const status = document.getElementById("otpStatus");
    const newPasswordInput = document.getElementById("newPassword");

    // 1) empty
    if (otp === "") {
        status.innerText = "Enter OTP";
        status.style.color = "red";
        return;
    }

    // 2) call PHP
    fetch("../php/verify_otp.php", {
        method: "POST",
        credentials: "same-origin",
        body: new URLSearchParams({ otp: otp }),
    })
        .then((res) => res.text())
        .then((data) => {
            const resetSubmitBtn = document.getElementById("resetSubmitBtn");
            const otpInput = document.getElementById("otp");
            const otpSubmitBtn = document.getElementById("otpSubmitBtn");

            if (data === "valid") {
                status.innerText = "OTP verified. Enter your new password.";
                status.style.color = "green";

                otpInput.disabled = true;
                if (otpSubmitBtn) otpSubmitBtn.disabled = true;
                newPasswordInput.disabled = false;
                if (resetSubmitBtn) resetSubmitBtn.disabled = false;
                newPasswordInput.focus();
            } else if (data === "expired") {
                status.innerText = "OTP expired. Request a new code.";
                status.style.color = "red";
                newPasswordInput.disabled = true;
                if (resetSubmitBtn) resetSubmitBtn.disabled = true;
            } else {
                status.innerText = "Invalid OTP";
                status.style.color = "red";
                newPasswordInput.disabled = true;
                if (resetSubmitBtn) resetSubmitBtn.disabled = true;
            }
        })
        .catch(() => {
            status.innerText = "Server error";
            status.style.color = "red";
        });
}
function resetPassword() {
    const passwordInput = document.getElementById("newPassword");
    const password = passwordInput.value.trim();
    const status = document.getElementById("resetStatus");

    if (password === "") {
        status.innerText = "Enter new password";
        status.style.color = "red";
        return;
    }

    if (password.length < 6) {
        status.innerText = "Password must be at least 6 characters";
        status.style.color = "red";
        return;
    }

    fetch("../php/reset_password.php", {
        method: "POST",
        credentials: "same-origin",
        body: new URLSearchParams({ password: password }),
    })
        .then((res) => res.text())
        .then((data) => {
            const otpInput = document.getElementById("otp");
            const otpSubmitBtn = document.getElementById("otpSubmitBtn");
            const emailInput = document.getElementById("email");
            const emailSubmitBtn = document.getElementById("emailSubmitBtn");
            const resetSubmitBtn = document.getElementById("resetSubmitBtn");

            if (data === "success") {
                passwordInput.disabled = true;
                if (resetSubmitBtn) resetSubmitBtn.disabled = true;
                if (otpInput) otpInput.disabled = true;
                if (otpSubmitBtn) otpSubmitBtn.disabled = true;
                if (emailInput) emailInput.disabled = true;
                if (emailSubmitBtn) emailSubmitBtn.disabled = true;

                status.innerText = "Password changed successfully ✔";
                status.style.color = "green";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else if (data === "unauthorized") {
                status.innerText = "Please verify OTP before resetting password.";
                status.style.color = "red";
            } else if (data === "invalid") {
                status.innerText = "Email no longer exists. Please restart the reset process.";
                status.style.color = "red";
            } else {
                status.innerText = "Error updating password";
                status.style.color = "red";
            }
        })
        .catch(() => {
            status.innerText = "Server error";
            status.style.color = "red";
        });
}