const apiBase = '../php/';

function initResetPasswordPage() {
    const emailInput = document.getElementById('email');
    const otpInput = document.getElementById('otp');
    const newPasswordInput = document.getElementById('newPassword');
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');

    if (emailInput) emailInput.disabled = false;
    if (otpInput) otpInput.disabled = true;
    if (newPasswordInput) newPasswordInput.disabled = true;
    if (otpSubmitBtn) otpSubmitBtn.disabled = true;
    if (resetSubmitBtn) resetSubmitBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', initResetPasswordPage);

async function fetchJson(endpoint, body) {
    const response = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`Invalid server response: ${text}`);
    }
}

function showStatus(id, message, color = 'red') {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = message;
        element.style.color = color;
    }
}

async function checkEmail() {
    const emailInput = document.getElementById('email');
    const otpInput = document.getElementById('otp');
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');
    const newPasswordInput = document.getElementById('newPassword');
    const emailSubmitBtn = document.getElementById('emailSubmitBtn');

    if (!emailInput) return;

    const email = emailInput.value.trim();
    showStatus('emailStatus', '');
    showStatus('otpStatus', '');
    showStatus('resetStatus', '');

    otpInput.value = '';
    newPasswordInput.value = '';
    otpInput.disabled = true;
    otpSubmitBtn.disabled = true;
    newPasswordInput.disabled = true;
    resetSubmitBtn.disabled = true;

    if (email === '') {
        showStatus('emailStatus', 'Enter a valid email');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showStatus('emailStatus', 'Enter correct email');
        return;
    }

    try {
        const data = await fetchJson('send_otp.php', { email });
        if (data.success && data.otp) {
            const statusElement = document.getElementById('emailStatus');
            if (statusElement) {
                statusElement.innerHTML = `
                    <span style="color:green;">
                        Correct email.
                        <span style="color:black;">Your OTP:</span>
                        <b style="color:blue;" id="otpCodeText">${data.otp}</b>
                    </span>
                    <button style="margin-left:15px;" type="button" onclick="copyOTP()">Copy</button>
                `;
            }
            emailInput.disabled = true;
            if (emailSubmitBtn) emailSubmitBtn.disabled = true;
            otpInput.disabled = false;
            if (otpSubmitBtn) otpSubmitBtn.disabled = false;
            otpInput.focus();
        } else if (data.message === 'invalid_email') {
            showStatus('emailStatus', 'Email not found');
        } else {
            showStatus('emailStatus', 'Server error');
        }
    } catch (error) {
        showStatus('emailStatus', 'Server error');
        console.error(error);
    }
}

function copyOTP() {
    const otpTextElement = document.getElementById('otpCodeText');
    if (!otpTextElement) return;

    navigator.clipboard.writeText(otpTextElement.innerText).then(() => {
        showStatus('emailStatus', 'Copied ✔', 'green');
    });
}

async function verifyOTP() {
    const otpInput = document.getElementById('otp');
    const newPasswordInput = document.getElementById('newPassword');
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');

    if (!otpInput) return;

    const otp = otpInput.value.trim();
    showStatus('otpStatus', '');
    showStatus('resetStatus', '');

    if (otp === '') {
        showStatus('otpStatus', 'Enter OTP');
        return;
    }

    try {
        const data = await fetchJson('verify_otp.php', { otp });
        if (data.success && data.message === 'valid') {
            showStatus('otpStatus', 'OTP verified. Enter your new password.', 'green');
            otpInput.disabled = true;
            if (otpSubmitBtn) otpSubmitBtn.disabled = true;
            newPasswordInput.disabled = false;
            if (resetSubmitBtn) resetSubmitBtn.disabled = false;
            newPasswordInput.focus();
        } else if (data.message === 'expired') {
            showStatus('otpStatus', 'OTP expired. Request a new code.');
        } else {
            showStatus('otpStatus', 'Invalid OTP');
            if (resetSubmitBtn) resetSubmitBtn.disabled = true;
        }
    } catch (error) {
        showStatus('otpStatus', 'Server error');
        console.error(error);
    }
}

async function resetPassword() {
    const passwordInput = document.getElementById('newPassword');
    const otpInput = document.getElementById('otp');
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');
    const emailInput = document.getElementById('email');
    const emailSubmitBtn = document.getElementById('emailSubmitBtn');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');

    if (!passwordInput) return;

    const password = passwordInput.value.trim();
    showStatus('resetStatus', '');

    if (password === '') {
        showStatus('resetStatus', 'Enter new password');
        return;
    }

    if (password.length < 6) {
        showStatus('resetStatus', 'Password must be at least 6 characters');
        return;
    }

    try {
        const data = await fetchJson('reset_password.php', { password });
        if (data.success) {
            passwordInput.disabled = true;
            if (resetSubmitBtn) resetSubmitBtn.disabled = true;
            if (otpInput) otpInput.disabled = true;
            if (otpSubmitBtn) otpSubmitBtn.disabled = true;
            if (emailInput) emailInput.disabled = true;
            if (emailSubmitBtn) emailSubmitBtn.disabled = true;
            showStatus('resetStatus', 'Password changed successfully ✔', 'green');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else if (data.message === 'unauthorized') {
            showStatus('resetStatus', 'Please verify OTP before resetting password.');
        } else if (data.message === 'invalid') {
            showStatus('resetStatus', 'Email no longer exists. Please restart the reset process.');
        } else {
            showStatus('resetStatus', 'Error updating password');
        }
    } catch (error) {
        showStatus('resetStatus', 'Server error');
        console.error(error);
    }
}