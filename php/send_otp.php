<?php

session_start();

$conn = new mysqli("localhost", "root", "", "users");

$email = $_POST['email'] ?? '';

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    // هنا تقدر تولد OTP بعد ما تتأكد
    $otp = rand(100000, 999999);
    $_SESSION['otp'] = $otp;
    $_SESSION['email'] = $email;

    echo "valid|$otp";
} else {
    echo "invalid";
}
?>