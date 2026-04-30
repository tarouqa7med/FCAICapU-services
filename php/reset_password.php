<?php
session_start();

$conn = new mysqli("localhost", "root", "", "users");

$password = $_POST['password'] ?? '';

if ($password == "") {
    echo "empty";
    exit;
}

// لازم يكون verified OTP
if (!isset($_SESSION['email']) || !isset($_SESSION['otp'])) {
    echo "error";
    exit;
}

$email = $_SESSION['email'];

// تشفير الباسورد
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// تحديث الباسورد
$sql = "UPDATE users SET password = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $hashedPassword, $email);

if ($stmt->execute()) {

    // ✅ امنع إعادة الاستخدام
    session_destroy();

    echo "success";
} else {
    echo "error";
}
?>