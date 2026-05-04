
<?php
session_start();

$userOtp = $_POST['otp'] ?? '';

if ($userOtp == "") {
    echo "empty";
    exit;
}

if (!isset($_SESSION['otp'])) {
    echo "invalid";
    exit;
}

if ($userOtp == $_SESSION['otp']) {
    echo "valid";
} else {
    echo "invalid";
}