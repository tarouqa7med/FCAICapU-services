function checkEmail() {
    const email = document.getElementById("email").value.trim();
    const status = document.getElementById("emailStatus");
    const otpInput = document.getElementById("otp");

    // 1) empty
    if (email === "") {
        status.innerText = "Enter a valid email";
        status.style.color = "red";
        otpInput.disabled = true;
        return;
    }

    // 2) email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        status.innerText = "Enter correct email";
        status.style.color = "red";
        otpInput.disabled = true;
        return;
    }

    // 3) valid format → now call PHP (AJAX)
    fetch("../php/send_otp.php", {
        method: "POST",
        body: new URLSearchParams({ email: email }),
    })
        .then((res) => res.text())
        .then((data) => {
            if (data.startsWith("valid")) {
                const parts = data.split("|");
                const otpCode = parts[1]; // 👈 ده OTP الحقيقي من PHP

                status.innerHTML = `
                                <span style="color:green;">
                                    Correct email. 
                                    <span style="color:black;">Your OTP:</span> 
                                    <b style="color:blue;" id="otpCodeText">${otpCode}</b>
                                </span>
                                <button style="margin-left:15px;" type="button" onclick="copyOTP()">Copy</button>
                            `;

                otpInput.disabled = false;
            } else {
                status.innerText = "Wrong email";
                status.style.color = "red";
                otpInput.disabled = true;
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
        body: new URLSearchParams({ otp: otp }),
    })
        .then((res) => res.text())
        .then((data) => {
            if (data === "valid") {
                status.innerText = "OK";
                status.style.color = "green";

                newPasswordInput.disabled = false;
            } else {
                status.innerText = "Invalid OTP";
                status.style.color = "red";
                newPasswordInput.disabled = true;
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
        body: new URLSearchParams({ password: password }),
    })
        .then((res) => res.text())
        .then((data) => {
            if (data === "success") {
                // ✅ اقفل الانبوت
                passwordInput.disabled = true;

                // ✅ رسالة نجاح
                status.innerText = "Password changed successfully ✔";
                status.style.color = "green";

                // ✅ منع إعادة التغيير
                document.querySelector("button[type='submit']").disabled = true;

                // ✅ redirect بعد ثانيتين
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
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
